$env:GIT_AUTHOR_NAME = "AnujSingh0212U"
$env:GIT_AUTHOR_EMAIL = "248714132+AnujSingh0212U@users.noreply.github.com"
$env:GIT_COMMITTER_NAME = "AnujSingh0212U"
$env:GIT_COMMITTER_EMAIL = "248714132+AnujSingh0212U@users.noreply.github.com"

Set-Location (Split-Path $PSScriptRoot -Parent)
git add README.md LICENSE CONTRIBUTING.md scripts/commit-remaining.ps1 scripts/rewrite-history.ps1
git commit -m "docs: update ownership and links for AnujSingh0212U account"
