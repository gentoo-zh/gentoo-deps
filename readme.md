You can use this workflow to generate Gentoo dependency tarballs manually.

For automated builds, [crate-dist-mirror-action](https://github.com/projg2/crate-dist-mirror-action) and [golang-dist-mirror-action](https://github.com/projg2/golang-dist-mirror-action) are recommended.


Support:

 - Golang: `${P}-deps.tar.xz` and `${P}-vendor.tar.xz`
 - Javascript: `${P}-node_modules.tar.xz`
 - rust: `${P}-crates.tar.xz`

How to use this?

 - Step 1: Fork this repo

 - Step 2: manual trigger workflow:

![](./resources/screenshot.png)
