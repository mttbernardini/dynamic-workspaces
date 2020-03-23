:herb: Cinnamon Extension - Dynamic Workspaces
==============================================

Attempt to introduce dynamic workspaces (as in GNOME 3) to Cinnamon.

## Installation

```sh
cd ~/.local/share/cinnamon/extensions/
wget https://github.com/mttbernardini/dynamic-workspaces/archive/master.zip
unzip master.zip
mv dynamic-workspaces{-master,@mttbernardini}
rm master.zip
```

## Dev notes

- This extensions is based on reverse-engineering other Cinnamon extensions and Cinammon's source code itself, because I could not find any reasonable documentation.
- It kind of works, but a lot is still to be done (fixing crashes, optimizing performances, testing).

---
© 2020 Matteo Bernardini
