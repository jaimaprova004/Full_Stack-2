$base = 'http://localhost:8080/api/posts'

function Wait-Server {
  for ($i=0; $i -lt 30; $i++) {
    try { Invoke-RestMethod -Uri $base -Method Get -ErrorAction Stop; return }
    catch { Start-Sleep -Seconds 1 }
  }
  throw 'Server did not become ready in time.'
}

Wait-Server

$create = Invoke-RestMethod -Uri $base -Method Post -ContentType 'application/json' -Body (@{title='Smoke';content='Smoke test';author='CI'} | ConvertTo-Json)
Write-Host "Created:`n" ($create | ConvertTo-Json -Depth 5)

$list = Invoke-RestMethod -Uri $base -Method Get
Write-Host "List count: " ($list.data | Measure-Object).Count

$id = $create.data.id

$get = Invoke-RestMethod -Uri "$base/$id" -Method Get
Write-Host "Got id $id
"

Invoke-RestMethod -Uri "$base/$id" -Method Put -ContentType 'application/json' -Body (@{title='Smoke2';content='Updated';author='CI'} | ConvertTo-Json)
Write-Host "Updated $id"

Invoke-RestMethod -Uri "$base/$id" -Method Delete
Write-Host "Deleted $id"
