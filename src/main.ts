import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene';
import { layout, theme } from './theme';

document.body.style.backgroundColor = `#${theme.colors.background.toString(16).padStart(6, '0')}`;

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: layout.width,
  height: layout.height,
  backgroundColor: theme.colors.background,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MenuScene],
});
