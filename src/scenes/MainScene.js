import GenericScene from './GenericScene'
import _ from 'lodash'

const SIZE = 1000

export class MainScene extends GenericScene {
  constructor() {
    super('MainMenu')
  }

  preload() {
    this.load.image('Pixel', 'assets/Pixel.png')
  }

  create() {
    super.create()

    const renderTexture = this.add.renderTexture(0, 0, SIZE, SIZE)

    renderTexture.beginDraw()
    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        // Multiplied coordinates by two to demonstrate the problem, there should be nothing drawn to
        // coordinates with an odd x or y, and yet entire rows are missing from certain y coordinates and drawn to odd y coordinates instead
        // This problem disappears on lower sizes
        renderTexture.batchDrawFrame(
          'Pixel',
          undefined,
          x * 2,
          y * 2,
          1,
          _.random(0x000000, 0xffffff),
        )
      }
    }
    renderTexture.endDraw()
  }
}
