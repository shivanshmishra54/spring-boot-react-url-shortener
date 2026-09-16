@echo off
echo Installing Cloudflare Tunnel as Windows Service...
cloudflared.exe service install eyJhIjoiN2I5Y2I4ZTExMTJlOWRmZmZiODY0YjAzYjk3MjU2MjAiLCJ0IjoiYmFmZTlhYzItMWZlMC00MzFkLTkyZmItOWJmNmMyM2Q2NTkwIiwicyI6Ik1qaGlZVEk0Wm1FdE1tTmhNaTAwWlRkakxUazNOR1F0Wm1ZNU1tSm1ObUV3WkRObCJ9
if %errorlevel% == 0 (
    echo SUCCESS: Service installed!
    net start cloudflared
    echo Cloudflare Tunnel service started!
) else (
    echo ERROR: Failed to install service.
)
pause
