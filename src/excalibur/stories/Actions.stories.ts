import { withKnobs, number } from '@storybook/addon-knobs';
import { Actor, Texture, Loader } from '../engine';
import { withEngine } from './utils';

import heartTexture from './assets/heart.png';

export default {
  title: 'Actions',
  decorators: [withKnobs]
};

export const fade: Story = withEngine(async (game) => {
  const hrt = new Texture(heartTexture);
  const ldr = new Loader([hrt]);

  await game.start(ldr);

  game.setAntialiasing(false);
  game.currentScene.camera.z = 4;
  const heart = new Actor(game.currentScene.camera.x, game.currentScene.camera.y, 50, 50);
  heart.addDrawing(hrt);

  heart.opacity = 0;

  game.add(heart);

  heart.actions
    .fade(number('Starting Opacity', 1), number('Duration', 200))
    .delay(number('Delay', 2000))
    .fade(number('Ending Opacity', 0), number('Duration', 200));
});

fade.story = {
  parameters: {
    componentSubtitle: 'Fade action',
    docs: { storyDescription: 'Use `Actor.fade()` to fade in or out the Actor over time' }
  }
};
