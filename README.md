# Point cloud demo by Maarten Bicknese

To get started, either host all source files in your own web server. Or start the dev stack by running:

```shell
docker compose up -d
```

## Assumptions

As this is a proof of concept, and a solution to a challenge, it is not a production ready application. Being so, a couple of assumptions are made.

 - All code runs in a WebGL capable browser.
 - JavaScript execution in browser is turned on and allowed.
 - Tests are skipped in favour of quick prototyping.

## Not implemented

Things I would do differently, or add to the application when given more time

 - [ ] Document design decisions in ADRs.
 - [ ] Add a notification system for success verifications and error messages.
 - [ ] Redo the mutations interface. Although the controls end up near the 3D object, it's not as intuitive as can be.
 - [ ] Improve the shaders. Some fog to add to the sense of depth, as well as working transparency for the cuboids.
 - [ ] (Optional) Execute debounced raycasts to highlight hovered over geometry. 
