Set WshShell = WScript.CreateObject("WScript.Shell")
' File downloaded from fetch_s2ma.yml Github Action file
WshShell.Run "C:\Battle.net-Setup.exe"
' Wait 5s for it to launch
WScript.Sleep(5000)
' Bring the installer to the active window
WshShell.AppActivate "Battle.net Setup"
' First enter to select default language
WshShell.SendKeys "{ENTER}"
' Prompt: Updating Battle.net Update Agent....
' Wait 20s
WScript.Sleep(20000)
' Bring the installer to the active window
WshShell.AppActivate "Battle.net Setup"
' Second Enter to Accept default install
WshShell.SendKeys "{ENTER}"
' Wait 60s for installation
WScript.Sleep(60000)
' Now the login screen should popup...

' Done. (hopefully...)