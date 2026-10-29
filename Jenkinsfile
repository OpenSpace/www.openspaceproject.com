def url = 'https://github.com/OpenSpace/www.openspaceproject.com';
def branch = env.BRANCH_NAME

// Uncomment all of this once we are ready to go live
def mainTarget = "www.openspaceproject.com"
def stagingTarget = "staging.www.openspaceproject.com"

def target;
if (branch == "master") {
  target = mainTarget;
}
else if (branch == "staging") {
  target = stagingTarget;
}
else {
  // Nothing to do for any other branch
   currentBuild.result = "SUCCESS";
   return;
}

node("server-misc") {
  stage("SCM") {
    deleteDir();
    gitHelper.checkoutGit(url, branch, false);
  }
  stage("Lint") {
    // stylelint + ESLint. Fails the build on any error so lint regressions can't reach
    // the rendered site
    sh(
      script: "npm ci && npm run lint",
      label: "npm lint"
    )
  }
  stage("Quarto") {
    sh(
      script: "pip install -r requirements.txt",
      label: "PIP install"
    )
    sh(
      script: "quarto render${branch == 'staging' ? ' --profile staging' : ''}",
      label: "Quarto rendering"
    )
  }
  stage("Link check") {
    // Check every link in the rendered site; internal links against a local copy of the
    // new build (so new pages aren't falsely checked against the old live site), external
    // links live
    //
    // The binary is pinned and downloaded into the workspace each build; no dependency on
    // what's installed on the agent
    sh(
      script: """
        curl -sSL https://github.com/lycheeverse/lychee/releases/download/lychee-v0.19.1/lychee-x86_64-unknown-linux-musl.tar.gz | tar xz
        chmod +x lychee
        python3 -m http.server 8123 --directory _site >/dev/null 2>&1 &
        SERVER_PID=$!
        sleep 1
        ./lychee --no-progress --base-url http://localhost:8123 _site
        RC=$?
        kill $SERVER_PID
        exit $RC
      """,
      label: "lychee"
    )
  }
  stage("Archive") {
    // Keep a copy of the rendered site on the Jenkins master for rollback. Videos are
    // excluded; they're the bulk of the site and are served from the CDN anyway
    archiveArtifacts artifacts: '_site', excludes: '_site/assets/videos/**'
  }
  stage("Deploy") {
    sh(
      script: "chmod -R o+rx _site",
      label: "Permissions"
    )
    sh(
      script: "mv _site /var/www/${target}",
      label: "Staging"
    )
    sh(
      script: "mv /var/www/${target}/html /var/www/${target}/html-prev",
      label: "Destaging"
    )
    sh(
      script: "mv /var/www/${target}/_site /var/www/${target}/html",
      label: "Deploy"
    )
    sh(
      script: "rm -rf /var/www/${target}/html-prev",
      label: "Cleanup"
    )
  }
}
