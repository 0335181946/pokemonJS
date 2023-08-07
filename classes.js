class Sprite {
    constructor({ position, velocity, image, frames = { max: 1, hold: 10 }, sprites, animate = false,
        rotation = 0,
    }) {
        this.position = position
        this.image = new Image()
        this.frames = { ...frames, val: 0, elapsed: 0 }

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation
    }

    draw() {
        c.save()
        c.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        )
        c.rotate(this.rotation)
        c.translate(
            -this.position.x - this.width / 2,
            - this.position.y - this.height / 2
        )
        c.globalAlpha = this.opacity
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        c.restore()

        if (!this.animate) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

class Monster extends Sprite {

    constructor({
        position, velocity, image, frames = { max: 1, hold: 10 }, sprites, animate = false,
        rotation = 0,
        isEnemy = false,
        name,
        attacks
    }) {
        super({
            position, velocity, image, frames, sprites, animate,
            rotation,
        })
        this.heath = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }

    faint() {
        document.querySelector('#dialogBox').innerHTML = this.name + ' was defeated!'
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
    }

    attack({ attack, recipient, renderSprites }) {
        document.querySelector('#dialogBox').style.display = 'block'
        document.querySelector('#dialogBox').innerHTML = this.name + ' used ' + attack.name

        recipient.heath -= attack.damage

        let heathBar = '#enemyHeathBar'
        if (this.isEnemy) heathBar = '#playerHeathBar'

        let rotation = 1
        if (this.isEnemy) rotation = -1

        switch (attack.name) {
            case 'Thundervolt':
                const thunderImage = new Image()
                thunderImage.src = './img/thunder.png'
                const thunder = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: thunderImage,
                    frames: {
                        max: 1,
                        hold: 10
                    },
                    animate: true,
                    rotation
                })
                renderSprites.splice(1, 0, thunder)

                gsap.to(thunder.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        //enemy get damage
                        gsap.to(heathBar, {
                            width: recipient.heath + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 3,
                            duration: 0.08
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        renderSprites.splice(1, 1)
                    }
                })
                break

            case 'Tail':
                const tl = gsap.timeline()

                let movementDistance = 20
                if (this.isEnemy) movementDistance = - 20

                tl.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: 0.1,
                    onCompplete: () => {
                        //enemy get damage
                        gsap.to(heathBar, {
                            width: recipient.heath + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 3,
                            duration: 0.08
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                    }
                }).to(this.position, {
                    x: this.position.x
                })
                break;
        }
    }
}

class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw() {
        c.fillStyle = 'rgba(255, 0,0,0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}