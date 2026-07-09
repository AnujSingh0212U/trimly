$env:GIT_AUTHOR_NAME = "Anuj Singh"
$env:GIT_AUTHOR_EMAIL = "singhanuj112411@gmail.com"
$env:GIT_COMMITTER_NAME = "Anuj Singh"
$env:GIT_COMMITTER_EMAIL = "singhanuj112411@gmail.com"

Set-Location (Split-Path $PSScriptRoot -Parent)
git add README.md LICENSE CONTRIBUTING.md scripts/finalize-and-push.ps1
git commit -m "docs: set contributor name to Anuj Singh and update contact email"
