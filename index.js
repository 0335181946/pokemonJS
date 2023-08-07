const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1424
canvas.height = 776


const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZoneMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZoneMap.push(battleZonesData.slice(i, 70 + i))
}



const offset = {
    x: -725,
    y: -360
}

const boundaries = []
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 2177)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

const battleZones = []
battleZoneMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 1638)
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})


const image = new Image()
image.src = './img/Pokemon Map.png'

const foregroundImage = new Image()
foregroundImage.src = './img/DoituongUutien.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2 - 30,
        y: canvas.height / 2 - 68 / 4 / 4 - 20
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 20
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})


const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangeCollisions({ rectange1, rectange2 }) {
    return (
        rectange1.position.x + rectange1.width >= rectange2.position.x &&
        rectange1.position.x <= rectange2.position.x + rectange2.width &&
        rectange1.position.y <= rectange2.position.y + rectange2.height &&
        rectange1.position.y + rectange1.height >= rectange2.position.y
    )
}

const battle = {
    initiated: false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()

    })
    battleZones.forEach((battleZone) => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    if (battle.initiated) return
    //active a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width)
                - Math.max(player.position.x, battleZone.position.x))
                * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height)
                    - Math.max(player.position.y, battleZone.position.y))

            if (
                rectangeCollisions({
                    rectange1: player,
                    rectange2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2 && Math.random() < 0.012
            ) {
                console.log('active battle')
                //deactivate current loop
                window.cancelAnimationFrame(animationId)
                battle.initiated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                //active a new animation loop
                                initBattle()
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4
                                })
                            }
                        })
                    }
                })
                break
            }
        }
    }


    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangeCollisions({
                    rectange1: player,
                    rectange2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {

                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) => { movable.position.y += 3 })
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangeCollisions({
                    rectange1: player,
                    rectange2: {
                        ...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {

                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) => { movable.position.x += 3 })
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangeCollisions({
                    rectange1: player,
                    rectange2: {
                        ...boundary, position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {

                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) => { movable.position.x -= 3 })
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangeCollisions({
                    rectange1: player,
                    rectange2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {

                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) => { movable.position.y -= 3 })
    }


}
//animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }

})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }

})

