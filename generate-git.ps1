# READ ME:
# Please note that this file is for myself, not intended to be used generally.
# However, you can modify this file to fit your needs.
# 
# In my configuration, all the Extracted Heroes of the Storm files are stored at:
# 
#     D:\HeroesSnapshots
# 
# 
# Inside the directory, Each version of the game will have two directory with the name of:
# 
#     HeroesSnapshot_GAMEVERSION_(DESCRIPTION)
#     HeroesSnapshot_GAMEVERSION_(DESCRIPTION)_Data
# 
#     Whereas:
#       GAMEVERSION: The full version number of the game, e.g 2.52.2.82624
#       DESCRIPTION: A manually added description for easier future reference, e.g 20201104WarheadRework
# 
#     The first dirctory is for ALL files extracted, where the second directory (with _Data suffix)
#     is for only data files. Please see README.md for what file types are.
# 
#     This is done by my other tool: https://github.com/jamiephan/HeroesOfTheStorm_Tools/tree/main/Heroes%20Snapshot%20Generator
# 
# ** This script will also force push to the remote repository. **
# **  So careful when using this tool against a working repo.   **


$repo = "jamiephan/HeroesOfTheStorm_Gamedata"
$branch = "master"
$srcDir = "D:\HeroesSnapshots"
$originCrlfWarning = $(&git config core.safecrlf)

# Delete all remote tags
git push origin --delete $(git tag -l)

# Delete ".git" folder
if (Test-Path "./.git") {
  Remove-Item "./.git" -Recurse -Force
  Write-Output "Deleted ./.git directory"
}

# Delete Mods Folder 
if (Test-Path "./mods") {
  Remove-Item "./mods" -Recurse -Force
  Write-Output "Deleted Local ./mods directory"
}

# Delete and create xsd Folder 
if (Test-Path "./xsd") {
  Remove-Item "./xsd" -Recurse -Force
  Write-Output "Deleted Local ./xsd directory"
}
New-Item -Path "./xsd" -ItemType "Directory" | Out-Null


# Delete and Create VERSIONS.md
if (Test-Path "./VERSIONS.md") {
  Remove-Item "./VERSIONS.md"-Force
  Write-Output "Deleted ./VERSIONS.md"
}


New-Item "./VERSIONS.md" | Out-Null
Set-Content "./VERSIONS.md" "# Game Versions:`r`n"

# Git init
&git init

# Git add the inital files
&git add .
git commit -m "Initial Commit"

# Tempoarily turn off CRLF warning,
&git config core.safecrlf false


Write-Output "Source Directory: $srcDir" 
Get-ChildItem -Directory -Path "$srcDir" -Filter "*_Data" | ForEach-Object {
  $version = [regex]::Match($_.Name, "HeroesSnapshot_(.*?)_").Groups[1].Value
  $dirName = $_.Name
  Write-Output "Directory: $dirName, Version: $version" 
  
  # Delete Mods Folder here
  if (Test-Path "./mods") {
    Remove-Item "./mods" -Recurse -Force
    Write-Output "Deleted Local ./mods directory"
  }

  # Copy mods $dirName/folder to here
  Write-Output "Copying $srcDir/$dirName/mods to ./mods"
  Copy-Item "$srcDir/$dirName/mods" -Destination "./mods" -Recurse

  # Create XSD File
  
  # Copy all XML files to temp, and renmae it with [hash]/.xml
  if (Test-Path "./_temp_") {
    Remove-Item "./_temp_"-Force -Recurse
  }
  New-Item -Path "./_temp_" -ItemType "Directory" | Out-Null
  Write-Output "Copying XML files to temp"
  Get-ChildItem -Path "./mods" -Filter *.xml -Recurse -File | ForEach-Object {
    $filePath = $_.FullName
    $filePathHash = $(Get-FileHash -Path $filePath -Algorithm "md5").Hash
    Copy-Item -Path $filePath "./_temp_/$filePathHash.xml"  -Force
  }
  Write-Output "Generating XDS File"
  &java -jar "./trang.jar" -I xml -O xsd "./_temp_/*.xml" "./xsd/$version.xsd"
  
  # Replace latest.xsd 
  if (Test-Path "./xsd/latest.xsd") {
    Remove-Item "./xsd/latest.xsd" -Recurse -Force
  }
  &java -jar "./trang.jar" -I xml -O xsd "./_temp_/*.xml" "./xsd/latest.xsd"

  # Creating commit
  Write-Output "Creating Commit: Updated Files to $version"
  &git add "./mods"
  &git add "./xsd"
  &git commit -m "Updated Files to $version"
  
  # Tag the commit
  $commitHash = $(&git log --format="%H" -n 1)
  &git tag -a "v$version" "$commitHash" -m "Game Version: $version"
  
  # Write to VERSIONS.md
  Add-Content "./VERSIONS.md" -Value "`n- $version`: [``Commit``](https://github.com/$repo/commit/$commitHash) | [``Tag``](https://github.com/$repo/releases/tag/v$version) | [``XSD``](./xsd/$version.xsd)"

  # Commit VERSIONS.md
  &git add "./VERSIONS.md"
  &git commit -m "Updated VERSION.md with $version"
}

# Completed generating the commit log
# Add the git origin and **force push**
&git remote add  -m "$branch" origin "https://github.com/$repo.git"
&git push origin $branch --force

# Push the tags
&git push --tags --force

# Restore CRLF warning to original configuration
&git config core.safecrlf $originCrlfWarning








