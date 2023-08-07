const embyImage = new Image()
embyImage.src = './img/pikachu.png'

const draggleImage = new Image()
draggleImage.src = './img/mrayqaza.png'

const monsters = {
    Emby: {
        position: {
            x: 280,
            y: 270
        },
        image: {
            src: './img/Pikachu.png'
        },
        frames: {
            max: 1,
            hold: 30
        },
        animate: true,
        name: 'Pikachu',
        attacks: [attacks.Tail, attacks.Thundervolt]
    },
    Draggle: {
        position: {
            x: 1020,
            y: -10
        },
        image: {
            src: './img/Mrayqaza.png'
        },
        frames: {
            max: 1,
            hold: 30
        },
        animate: true,
        isEnemy: true,
        name: 'Rayqaza',
        attacks: [attacks.Tail, attacks.Thundervolt]
    }
}