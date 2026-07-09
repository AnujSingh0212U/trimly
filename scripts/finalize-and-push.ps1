$env:GIT_AUTHOR_NAME = "Anuj Singh"
$env:GIT_AUTHOR_EMAIL = "singhanuj112411@gmail.com"
$env:GIT_COMMITTER_NAME = "Anuj Singh"
$env:GIT_COMMITTER_EMAIL = "singhanuj112411@gmail.com"
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

Set-Location (Split-Path $PSScriptRoot -Parent)

git add README.md LICENSE CONTRIBUTING.md
git commit -m "docs: set contributor name to Anuj Singh and update contact email"

git filter-branch -f --env-filter "export GIT_AUTHOR_NAME='Anuj Singh'; export GIT_AUTHOR_EMAIL='singhanuj112411@gmail.com'; export GIT_COMMITTER_NAME='Anuj Singh'; export GIT_COMMITTER_EMAIL='singhanuj112411@gmail.com';" --msg-filter "grep -v 'Co-authored-by: Cursor'" HEAD

Write-Host "Commits: $(git rev-list --count HEAD)"
git log -1 --format=full
