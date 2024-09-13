# HeroesOfTheStorm_Gamedata

A Repo to host all the Game Data files from Heroes of the Storm.

This can also take advantage of git's diff tool to check what have been changed.

*Heroes of the Storm - Current version in Battle.net (us region):*

![Endpoint Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fbnet-version.jamiephan.workers.dev%2Fhero%2Fus%2FVersionsName%2Fbadge)

>If you have GitHub logged-in, you can press <kbd>.</kbd> to open a web version of VSCode to easily view the files without cloning. ([Github doc](https://docs.github.com/en/codespaces/the-githubdev-web-based-editor))

# CI

A [GitHub action have been setup](https://github.com/jamiephan/HeroesOfTheStorm_Gamedata/actions) to automatically fetch, extract and upload the game data *every night*.

Blizzard usually patches the game at around 17:00 GMT. The CI will trigger automatically at 01:00 AM GMT to prevent any delays on the patch launch. Therefore, expect around a 8 hours delay.

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
