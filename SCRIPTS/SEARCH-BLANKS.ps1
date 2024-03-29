$mail="$env:MAIL"
$list = Get-Content "./DATA/ID.txt"

foreach ($code in $list) {
#$code = '42510'
$id = ([xml](Get-Content "./DATA/ID.xml")).ID."id$code"

# compare with blanks
$TOTAL = Import-Csv -Path "./SPECIES/TOTAL/CSV/ALL-SPECIES-$id.csv" -delimiter ","
$BLANKS = Import-Csv -Path "./DATA/BLANKS.csv" -delimiter ","
$BLANKS.Vernaculaire | ?{$TOTAL.frname -notcontains $_} | Out-File "./SPECIES/LIST/SPECIES-BLANKS-$id.txt"
## not found in BLANKS.csv
$TOTAL.frname | ?{$BLANKS.Vernaculaire -notcontains $_} | Out-File "./SPECIES/LIST/SPECIES-NF-$id.txt"

}

$text = Get-Content dates.txt
$date = Get-Date -Format "dd/MM/yyyy"
$text = $text -replace "blanks & notfound : ([0-9]+/[0-9]+/[0-9]+)","blanks & notfound : $date" | Set-Content -Path "dates.txt"

# git and create tag
git config user.name 'github-actions[bot]'
git config user.email 'github-actions[bot]@users.noreply.github.com'
git add .
git commit -m "[Bot] Update files - BLANKS"
git push -f
