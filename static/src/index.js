'use strict';

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

conf.WIDTH = canvas.width;
conf.HEIGHT = canvas.height;

function Game(canvas){
    this.ctx = canvas.getContext('2d');
    this.generador = generate_balls(1000, 10);
    this.baller = new Baller(this.generador);

    this.state = {
        score: 0,
        state: true,
        food: undefined
    };

    this.wormi = new Worm(this.state);
    this.directions = {
        'N': [-1, 0],
        'W': [0, 1],
        'S': [1, 0],
        'E': [0, -1]
    };

    this.actual_direction = 'W';
    this.safe_direction = 'W';

    //Rollback mechanism
    this.wormi.rollback = rollback.bind(this);

    //Setting up the head
    this.wormi.add(this.generador.next().value);
    this.wormi.balls[0].setPos(20, 0);

    this.baller.dispatch()
    .then(ball => {
        this.state.food = ball;
    });

    this.interval = setInterval(loop.bind(this), 120);
};

function rollback() {
    this.actual_direction = this.safe_direction;
}

function loop() {
    if(this.state.state === false) {
        clearInterval(this.interval);
        
        send('guest', this.state.score)
        .then(res => res.json())
        .then(data => 'Buena, se envió el puntaje')
        .catch(err => console.error(err));
        
        fetch('/arcade')
        .then(res => res.json())
        .then(data => {
            let answ = '';
            for(let score of data) {
                answ += score.user + ': ' + score.score + '\n'
            }
            alert(answ);
        })
        .catch(err => console.log(err));

        return;
    }

    let dir = this.directions[this.actual_direction];
    this.wormi.move(dir[1] * 20, dir[0] * 20);
    this.ctx.clearRect(0, 0, conf.WIDTH, conf.HEIGHT);
    this.wormi.paint(this.ctx);

    if(this.state.food === undefined) {
        //REMOVE THIS FROM HERE
        //Generar una nueva bola después de un segundo
        setTimeout(() => {
            this.baller.dispatch()
            .then(ball => {
                this.state.food = ball;
            });
        }, 1000);

    } else {
        this.state.food.paint(this.ctx);
    }

}

function send(user, score) {
    return fetch('/arcade', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({user, score})
    })
}

let game = new Game(canvas);
window.addEventListener('keydown', move.bind(game), false);
