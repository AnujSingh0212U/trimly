Set-Location (Split-Path $PSScriptRoot -Parent)

$account = gh api user --jq ".login" 2>$null
if ($account -ne "AnujSingh0212U") {
  Write-Host "ERROR: GitHub CLI is logged in as '$account', not AnujSingh0212U."
  Write-Host "Run: gh auth login -h github.com -p https -w"
  Write-Host "Then: gh auth switch -u AnujSingh0212U"
  exit 1
}

$exists = gh repo view AnujSingh0212U/trimly 2>$null
if ($LASTEXITCODE -ne 0) {
  gh repo create AnujSingh0212U/trimly --public --source=. --remote=origin --description "Trimly - Production-ready URL Shortener SaaS with analytics, QR codes, and admin panel"
} else {
  git remote remove origin 2>$null
  git remote add origin https://github.com/AnujSingh0212U/trimly.git
}

git push -u origin main --force
Write-Host "Pushed to https://github.com/AnujSingh0212U/trimly"
