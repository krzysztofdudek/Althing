# Goal

Runes 1.2.0, on Runes alone: the reader gaps that a new family tool using the readers as they are (Lawcheck) found at Runes v1.1.0, issues 752 to 765 of the 6.2.0 loop, and the items moved out of Runes 1.1.0 (700, 709, 188, 736, 737, the Runes half of 586, and 739, 741, 743, 747, 750), each moved into this loop under its 6.2.0 number. The owner, 2026-11-16 (translated from Polish), answering a-41 and a-42 of the 6.2.0 loop: "Yes", to the question whether the items moved out of Runes 1.1.0 go to the next Runes version after the Lawcheck alpha, together with the 14 reader gaps the Lawcheck build found (752 to 765). The owner, 2026-11-17 (translated from Polish), on working in parallel, the open track starting with Runes 1.2.0: "Well, I want to work in parallel, because what interests me is delivering the whole." Runes release/1.2.0 is cut from main at v1.1.0 (1f3476b); worker branches jarl/NNN-slug are cut from it. Pushing, tagging and publishing are the owner's word.

Range (moved-188): 188-188
Range (moved-586): 586-586
Range (moved-700): 700-700
Range (moved-709): 709-709
Range (moved-736-737): 736-737
Range (moved-739): 739-739
Range (moved-741): 741-741
Range (moved-743): 743-743
Range (moved-747): 747-747
Range (moved-750): 750-750
Range (moved-752-765): 752-765

Model (light): claude-haiku-5-5
Model (standard): claude-haiku-5-5
Model (strong): claude-opus-5-5

Check (Runes): npm run check
Check (Yggdrasil): devcontainer: cd source/cli && npm test
Check (Grain): cd plugins/grain && npm test
Check (JarlSkill): cd skills/jarl/scripts && npm test
Check (Horde): cd skills/horde/scripts && npm test
Check: yg check && npm test

Format: 4

## Assumptions

## Rules that apply here
