# ============================================================
#  update-tunnel.ps1 — Run this when Cloudflare tunnel URL changes
#  It automatically updates netlify.toml, .env, Docker, and pushes to git
# ============================================================

param(
    [string]$NewTunnelUrl = ""
)

# ─── Step 1: Start tunnel if not running, capture URL ───────────────────────
if ($NewTunnelUrl -eq "") {
    Write-Host "Starting Cloudflare tunnel..." -ForegroundColor Cyan
    $logFile = "$PSScriptRoot\tunnel.log"
    Start-Process -FilePath "cloudflared" -ArgumentList "tunnel --url http://localhost:8082" `
        -RedirectStandardOutput $logFile -RedirectStandardError $logFile -NoNewWindow
    
    Write-Host "Waiting for tunnel URL..." -ForegroundColor Yellow
    $timeout = 30
    $elapsed = 0
    while ($elapsed -lt $timeout) {
        Start-Sleep -Seconds 2
        $elapsed += 2
        if (Test-Path $logFile) {
            $content = Get-Content $logFile -Raw -ErrorAction SilentlyContinue
            if ($content -match "https://[a-z0-9\-]+\.trycloudflare\.com") {
                $NewTunnelUrl = $Matches[0]
                break
            }
        }
    }
    if ($NewTunnelUrl -eq "") {
        Write-Host "ERROR: Could not detect tunnel URL. Pass it manually:" -ForegroundColor Red
        Write-Host "  .\update-tunnel.ps1 -NewTunnelUrl https://your-url.trycloudflare.com" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "Tunnel URL: $NewTunnelUrl" -ForegroundColor Green
Write-Host ""

$projectRoot = $PSScriptRoot

# ─── Step 2: Update .env (BASE_URL for Docker) ──────────────────────────────
Write-Host "[1/4] Updating .env..." -ForegroundColor Cyan
$envPath = "$projectRoot\.env"
$envContent = "BASE_URL=$NewTunnelUrl"
Set-Content -Path $envPath -Value $envContent
Write-Host "      Done: BASE_URL=$NewTunnelUrl" -ForegroundColor Green

# ─── Step 3: Update netlify.toml proxy rules ────────────────────────────────
Write-Host "[2/4] Updating netlify.toml proxy..." -ForegroundColor Cyan
$netlifyPath = "$projectRoot\netlify.toml"
$netlify = Get-Content $netlifyPath -Raw
$netlify = $netlify -replace 'https://[a-z0-9\-]+\.trycloudflare\.com', $NewTunnelUrl
Set-Content -Path $netlifyPath -Value $netlify
Write-Host "      Done: Proxy → $NewTunnelUrl" -ForegroundColor Green

# ─── Step 4: Restart Docker url-shortener-service ───────────────────────────
Write-Host "[3/4] Restarting Docker url-shortener-service with new BASE_URL..." -ForegroundColor Cyan
Set-Location $projectRoot
docker compose up -d --force-recreate url-shortener-service
Write-Host "      Done!" -ForegroundColor Green

# ─── Step 5: Git commit & push ──────────────────────────────────────────────
Write-Host "[4/4] Pushing to GitHub (Netlify will auto-deploy)..." -ForegroundColor Cyan
Set-Location $projectRoot
git add .env netlify.toml
git commit -m "chore(tunnel): update tunnel URL to $NewTunnelUrl"
git push origin main
Write-Host "      Done! Netlify will deploy in ~2 minutes." -ForegroundColor Green

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host " ALL DONE! Your app is updated." -ForegroundColor Green
Write-Host " Tunnel: $NewTunnelUrl" -ForegroundColor White
Write-Host " Frontend: https://shortturll.netlify.app" -ForegroundColor White
Write-Host "=============================================" -ForegroundColor Green
