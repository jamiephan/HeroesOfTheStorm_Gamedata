# HeroesOfTheStorm_Gamedata

A Repo to host all the Game Data files from Heroes of the Storm.

This can also take advantage of git's diff tool to check what have been changed.

# CI

A [GitHub action have been setup](https://github.com/jamiephan/HeroesOfTheStorm_Gamedata/actions) to automatically fetch, extract and upload the game data *every night*.

Blizzard usually patches the game at around 17:00 GMT. The CI will trigger automatically at 01:00 AM GMT to prevent any delays on the patch launch. Therefore, expect around a 8 hours delay.

> However, if I am paying attention to the patches, I can manually trigger the CI earlier

# Versions

Please see [VERSIONS.md](VERSIONS.md) for a list of versions. The links of the version will direct to the commit URL.

(Special Thanks to Spazzo for providing a large amount of older game files!)

If you would like to download a specific version of the game, you can list see all the tags [here](https://github.com/jamiephan/HeroesOfTheStorm_Gamedata/tags). Click on one of the game versions and you can download the source code.

# Files

To reduce the extract file size, only the following file types will be extracted and uploaded to GitHub:

- `*.xml`: XMl files (Main data files)
- `*.txt`: txt files (Usually hold localization texts)
- `*.galaxy`: Game Logic, Trigger File
- `*.StormLayout`: UI Declaration File
- `*.StormHotkeys`: Hot Key File
- `*.StormStyle`: Styling File
- `*.StormCutscene`: Cutscene / Animation File
- `*.StormComponents`: Mod Inclusion List File
- `*.StormLocale`: Locale File

# XSD Files

Please see https://github.com/jamiephan/HeroesOfTheStorm_Tools/tree/main/XSD%20Schema%20Generator for XSD related documentations.
