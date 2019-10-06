'use strict';

// clicking API button GETs a JSON board
$('#api').click(function(event) {
    let url = 'https://api.noopschallenge.com/automatabot/rules/conway/random/'
    game.board.fetchGrid(url, game)
    console.log('API grid fetched, created, and rendered.')
})

// changing the #width field updates all fields, createTable(), and render()
$('#width').change(function(event) {
    game.createAll()
    console.log('Updated width: ' + $('#width').val())
})

// changing the #height field updates all fields, createTable(), and render()
$('#height').change(function(event) {
    game.createAll()
    console.log('Updated height: ' + $('#height').val())
})

// recreates boards and updates values when clicked, basically a worthless
// button but it was in the requirements
$('#create').click(function(event) {
    game.createAll()
    console.log('Created board.')
})

// changing the #delay field updates game.delay
$('#delay').change(function(event) {
    console.log('Updated delay: ' + $('#delay').val())
    game.setDelay($('#delay').val())
})

// clicking #play disables #play and #next, enables #pause, sets 
// game.pause to false, and calls play(game)
$('#play').click(function(event) {
    $(this).attr('disabled', 'disabled')
    $('#next').attr('disabled', 'disabled')
    $('#pause').removeAttr('disabled')
    game.setPause(false)
    game.play(game)
    console.log('Game playing.')
})

// clicking #pause disables #pause and enables #play and #next and
// sets game.pause to true
$('#pause').click(function(event) {
    $(this).attr('disabled', 'disabled')
    $('#play').removeAttr('disabled')
    $('#next').removeAttr('disabled')
    game.setPause(true)
    console.log('Game paused.')
})


// calls next() updating the table to the next frame
$('#next').click(function(event) {
    game.next()
    console.log('Next frame.')
})

// sets game.pause to true and disables #pause, clears the game grid
// and calls render() to print the new empty table
$('#clear').click(function(event) {
    game.setPause(true)
    $('#pause').attr('disabled', 'disabled')
    game.board.clearGrid()
    game.render()
    console.log('Grid cleared.')
})

// when clicking on a <td> elem of <table> the background color of the
// <td> is toggled from red to green and vice versa
$('#table').on('click', 'td', function(event) {
    game.toggleCell($(this).attr('x'), $(this).attr('y'))
})


// this class contains the entire game, it consists of width, height, delay,
// and pause values which define the frontend <table> functionality, and also
// contains a Board object which controls the grid arrays and business logic
class UI {
    constructor(width, height, delay) {
        this.width = width
        $('#width').val(width)

        this.height = height
        $('#height').val(height)

        this.delay = delay
        $('#delay').val(delay)

        this.pause = true
        this.board = new Board(width, height)
        this.createTable()
        this.render()
    }

    getWidth() {
        return this.width
    }

    setWidth(width) {
        this.width = width
        this.board.setWidth(width)
    }

    getHeight() {
        return this.height
    }

    setHeight(height) {
        this.height = height
        this.board.setHeight(height)
    }

    getDelay() {
        return this.delay
    }

    setDelay(delay) {
        this.delay = delay
    }

    getPause() {
        return this.pause
    }

    setPause(pause) {
        this.pause = pause
    }

    // this creates the html <table> representation of the Board grid variable
    createTable() {
        var table = $('#table');
        table.empty()

        for(var col = 0; col < this.getWidth(); col++) {
            var tableRow = $('<tr>');
            table.append(tableRow)
            for(var row = 0; row < this.getHeight(); row++) {
                var cell = $('<td id="' + col + '-' + row + '">')
                cell.attr('x', col)
                cell.attr('y', row)
                tableRow.append(cell);
            }
        }
    }

    // used to update all values and recreate both board arrays, and
    // then recreate the <table> and render() the <td> colors
    createAll(){
        game.setWidth($('#width').val())
        game.setHeight($('#height').val())
        game.setDelay($('#delay').val())
        game.board.grid = game.board.createGrid()
        game.board.resultGrid = game.board.createGrid()
        game.createTable()
        game.render()
    }

    // this function is called when a <td> elem is clicked, it switches
    // the <td>'s color from red to green or vice versa and updates the
    // corresponding cell's state appropriately
    toggleCell(x, y) {
        if(this.board.getCell(x, y) == ALIVE) {
            this.board.setCell(this.board.grid, x, y, DEAD)
            $('#' + x + '-' + y).css('backgroundColor', 'red')
        } else {
            this.board.setCell(this.board.grid, x, y, ALIVE)
            $('#' + x + '-' + y).css('backgroundColor', 'green')
        }
    }

    // calls board.tick() which is a Board function which creates the
    // next grid state in the board.grid, render() then creates the
    // html representation
    next() {
        this.board.tick()
        this.render()
    }

    // play() calls next() in a timed loop (using delay in ms) until
    // board.grid is all dead or until pause is set to true
    play(obj) {
        let intervalId = setInterval(function() {
            if(obj.getPause() || obj.board.deadGrid()) {
                clearInterval(intervalId)
            } else {
                obj.next()
            }
        }, obj.delay)
    }

    // render() goes through the board grid and colors the corresponding
    // <td> representation green is ALIVE and red if DEAD
    render() {
        for(let col = 0; col < this.getWidth(); col++) {
            for(let row = 0; row < this.getHeight(); row++) {
                if(this.board.getCell(col, row) == ALIVE) {
                    $('#' + col + '-' + row).css('backgroundColor', 'green')
                } else {
                    $('#' + col + '-' + row).css('backgroundColor', 'red')
                }
            }
        }
    }
}

//creates a new UI instance
let game = new UI(19, 19, 300)

// creates a pre-pulsar configuration which evolves into a period 3 pulsar
game.board.setCell(game.board.grid, 8, 5, ALIVE)
game.board.setCell(game.board.grid, 8, 6, ALIVE)
game.board.setCell(game.board.grid, 8, 7, ALIVE)
game.board.setCell(game.board.grid, 9, 7, ALIVE)
game.board.setCell(game.board.grid, 10, 7, ALIVE)
game.board.setCell(game.board.grid, 10, 6, ALIVE)
game.board.setCell(game.board.grid, 10, 5, ALIVE)
game.board.setCell(game.board.grid, 9, 5, ALIVE)

game.board.setCell(game.board.grid, 8, 11, ALIVE)
game.board.setCell(game.board.grid, 8, 12, ALIVE)
game.board.setCell(game.board.grid, 8, 13, ALIVE)
game.board.setCell(game.board.grid, 9, 13, ALIVE)
game.board.setCell(game.board.grid, 10, 13, ALIVE)
game.board.setCell(game.board.grid, 10, 12, ALIVE)
game.board.setCell(game.board.grid, 10, 11, ALIVE)
game.board.setCell(game.board.grid, 9, 11, ALIVE)

game.render()