const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/backgroundBattle.png'

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

let draggle
let emby
let renderSprites
let battleAnimationId
let queue

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogBox').style.display = 'none'
    document.querySelector('#enemyHeathBar').style.width = '100%'
    document.querySelector('#playerHeathBar').style.display = '100%'
    document.querySelector('#attacksBox').replaceChildren()

    draggle = new Monster(monsters.Draggle)
    emby = new Monster(monsters.Emby)
    renderSprites = [draggle, emby]
    queue = []

    emby.attacks.forEach((attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    //event listener button attack
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectAttack = attacks[e.currentTarget.innerHTML]
            emby.attack({
                attack: selectAttack,
                recipient: draggle,
                renderSprites
            })

            if (draggle.heath <= 0) {
                queue.push(() => {
                    draggle.faint()
                })
                queue.push(() => {
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'

                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })

                            battle.initiated = false
                        }
                    })
                })
            }

            const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

            queue.push(() => {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderSprites
                })

                if (draggle.heath <= 0) {
                    queue.push(() => {
                        emby.faint()
                    })

                    queue.push(() => {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#userInterface').style.display = 'none'

                                gsap.to('#overlappingDiv', {
                                    opacity: 0
                                })

                                battle.initiated = false
                            }
                        })
                    })


                }
            })
        })

        button.addEventListener('mouseenter', (e) => {
            const selectAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectAttack.type
            document.querySelector('#attackType').style.color = selectAttack.color

        })
    })
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    renderSprites.forEach((sprite) => {
        sprite.draw()
    })
}
animate()
// initBattle()
// animateBattle()



document.querySelector('#dialogBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'

})