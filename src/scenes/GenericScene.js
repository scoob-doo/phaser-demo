import Phaser from 'phaser'

const KeyCode = Phaser.Input.Keyboard.KeyCodes

/**
 * Includes middle mouse button panning functionality.
 * Includes zoom functionality
 */
class GenericScene extends Phaser.Scene {
  middleButtonDragOrigin = null

  keyMap = {
    [KeyCode.CTRL]: null,
    [KeyCode.W]: null,
    [KeyCode.A]: null,
    [KeyCode.S]: null,
    [KeyCode.D]: null,
  }

  constructor(sceneKey) {
    super(sceneKey)
  }

  get ctrlKey() {
    return this.keyMap[KeyCode.CTRL]
  }

  get wKey() {
    return this.keyMap[KeyCode.W]
  }

  get aKey() {
    return this.keyMap[KeyCode.A]
  }

  get sKey() {
    return this.keyMap[KeyCode.S]
  }

  get dKey() {
    return this.keyMap[KeyCode.D]
  }

  panCamera(dx, dy, scrollSpeed = 1) {
    const adjustedDx = (dx / this.cameras.main.zoom) * scrollSpeed
    const adjustedDy = (dy / this.cameras.main.zoom) * scrollSpeed

    this.cameras.main.scrollX -= adjustedDx
    this.cameras.main.scrollY -= adjustedDy
  }

  // Extended Methods
  create() {
    this.input.on('pointerdown', (pointer) => {
      if (pointer.middleButtonDown()) {
        this.middleButtonDragOrigin = { x: pointer.x, y: pointer.y }
      }
    })

    this.input.on('pointermove', (pointer) => {
      if (pointer.middleButtonDown() && this.middleButtonDragOrigin) {
        const dx = pointer.x - this.middleButtonDragOrigin.x
        const dy = pointer.y - this.middleButtonDragOrigin.y

        this.panCamera(dx, dy)

        // Update drag origin after calculating the new camera position
        this.middleButtonDragOrigin = { x: pointer.x, y: pointer.y }
      }
    })

    this.input.on('pointerup', (pointer) => {
      if (pointer.middleButtonReleased()) {
        this.middleButtonDragOrigin = null
      }
    })

    this.input.on('wheel', (pointer, _, __, deltaY) => {
      if (this.middleButtonDragOrigin) return // Currently dragging with middle mouse button

      if (!this.ctrlKey?.isDown) {
        // Apply zoom

        // Determine the direction of the scroll
        const zoomDirection = deltaY > 0 ? 1 : -1

        // Adjust the zoom step based on the current zoom level for smoother zooming
        // This could involve logarithmic scaling or other formulas
        const baseZoomStep = 0.1 // Base zoom step adjusted for smoother control
        const zoomFactor = Math.log10(this.cameras.main.zoom + 1) // Logarithmic adjustment
        const zoomStep = baseZoomStep * zoomFactor * 8 * zoomDirection
        const newZoom = this.cameras.main.zoom + zoomStep

        this.cameras.main.setZoom(newZoom)
      }
    })

    this.input.keyboard.on('keydown-Z', () => {
      const buildState = BuildState.GetInstance()
      buildState.undoStack?.undo()
    })
  }

  update(_, delta) {
    const scrollSpeed = 2.5 * delta
    if (this.sKey?.isDown) {
      this.panCamera(0, -1, scrollSpeed)
    } else if (this.wKey?.isDown) {
      this.panCamera(0, 1, scrollSpeed)
    }
    if (this.dKey?.isDown) {
      this.panCamera(-1, 0, scrollSpeed)
    } else if (this.aKey?.isDown) {
      this.panCamera(1, 0, scrollSpeed)
    }
  }

  enableKeys() {
    for (const key in this.keyMap) {
      this.keyMap[key] = this.input.keyboard.addKey(parseInt(key), false)
    }
  }

  disableKeys() {
    for (const key in this.keyMap) {
      this.keyMap[key]?.destroy()
      this.keyMap[key] = null
    }
  }

  get sceneKey() {
    return this.scene.key
  }
}

export default GenericScene
