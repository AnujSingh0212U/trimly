$env:FILTER_BRANCH_SQUELCH_WARNING = "1"
$env:GIT_AUTHOR_NAME = "AnujSingh0212U"
$env:GIT_AUTHOR_EMAIL = "248714132+AnujSingh0212U@users.noreply.github.com"
$env:GIT_COMMITTER_NAME = "AnujSingh0212U"
$env:GIT_COMMITTER_EMAIL = "248714132+AnujSingh0212U@users.noreply.github.com"

Set-Location (Split-Path $PSScriptRoot -Parent)

git filter-branch -f --env-filter "export GIT_AUTHOR_NAME='AnujSingh0212U'; export GIT_AUTHOR_EMAIL='248714132+AnujSingh0212U@users.noreply.github.com'; export GIT_COMMITTER_NAME='AnujSingh0212U'; export GIT_COMMITTER_EMAIL='248714132+AnujSingh0212U@users.noreply.github.com';" --msg-filter "grep -v 'Co-authored-by: Cursor'" HEAD

Write-Host "Rewritten commits: $(git rev-list --count HEAD)"
git log -1 --format=full
