import { initialiseGame } from './JustShip'

window.addEventListener('load', async () => {
  const containerElement = document.getElementById('game')
  if (!containerElement) {
    return
  }
  console.log('init')
  await initialiseGame(containerElement)
})
