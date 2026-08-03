# Local server for the Fake IRS Scam training simulation.
# Double-click start-fake-irs-scam.bat or run this script in PowerShell.

$Port = 8080
$Root = $PSScriptRoot
$Link = "http://localhost:$Port/fake-irs-scam.html"

$MimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".svg"  = "image/svg+xml"
}

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:$Port/")
$Listener.Start()

Write-Host ""
Write-Host "  Fake IRS Scam simulation is running!" -ForegroundColor Green
Write-Host ""
Write-Host "  Open this link in your browser:" -ForegroundColor Yellow
Write-Host "  $Link" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server." -ForegroundColor DarkGray
Write-Host ""

Start-Process $Link

try {
  while ($Listener.IsListening) {
    $Context = $Listener.GetContext()
    $Request = $Context.Request
    $Response = $Context.Response

    $RelativePath = [System.Uri]::UnescapeDataString($Request.Url.LocalPath.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($RelativePath)) {
      $RelativePath = "fake-irs-scam.html"
    }

    $FilePath = Join-Path $Root ($RelativePath -replace "/", [IO.Path]::DirectorySeparatorChar)

    if (Test-Path $FilePath -PathType Leaf) {
      $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
      $Extension = [System.IO.Path]::GetExtension($FilePath).ToLowerInvariant()
      $Response.ContentType = if ($MimeTypes.ContainsKey($Extension)) {
        $MimeTypes[$Extension]
      } else {
        "application/octet-stream"
      }
      $Response.StatusCode = 200
      $Response.ContentLength64 = $Bytes.Length
      $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
    } else {
      $Response.StatusCode = 404
      $NotFound = [Text.Encoding]::UTF8.GetBytes("404 - Not found: $RelativePath")
      $Response.ContentType = "text/plain; charset=utf-8"
      $Response.ContentLength64 = $NotFound.Length
      $Response.OutputStream.Write($NotFound, 0, $NotFound.Length)
    }

    $Response.Close()
  }
} finally {
  $Listener.Stop()
  $Listener.Close()
}
