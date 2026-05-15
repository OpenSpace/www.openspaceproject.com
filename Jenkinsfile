def url = 'https://github.com/OpenSpace/www.openspaceproject.com';
def branch = env.BRANCH_NAME

// Uncomment all of this once we are ready to go live
/*
def mainTarget = "www.openspaceproject.com"
def testingTarget = "testing.www.openspaceproject.com"

def target;
if (branch != "master") {
  target = testingTarget;
}
else {
  target = mainTarget;
}
*/

// Remove this once we are going live
def target = "testing.www.openspaceproject.com"

node("server-misc") {
  stage("SCM") {
    deleteDir();
    gitHelper.checkoutGit(url, branch, false);
  }
  stage("Quarto") {
    sh(
      script: "pip install -r requirements.txt",
      label: "PIP install"
    )
    sh(
      script: "quarto render",
      label: "Quarto rendering"
    )
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
