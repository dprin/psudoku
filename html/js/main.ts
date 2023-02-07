
/**
 * array of arrays which will hold each cell, 
 * starting from the top left corner of a square to the bottom right.
 */
let board = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],  
]

let selected = {x: -1, y: -1};
let hasIssue = () => {return wrong.x.length !== 0 || wrong.y.length !== 0 || wrong.block.length !== 0};
let wrong = {x: [{x: -1, y: -1}], y:[{x: -1, y: -1}], block: [-1]}

const generateGrid = () => {
    let output = "";
    for (let i = 0; i !== 9; i++) {
        output += `<div class="outer-square" id="${i}">`;

        for (let j = 0; j !== 9; j++){
            output += `<div class="inner-square" id="${i} ${j}" onClick="updateSelected(this.id)"></div>`;
        }

        output += `</div>`;
    }
    document.getElementById("board")!.innerHTML = output;
}

const updateSelected = (clickedId: string) => {
    let x = parseInt(clickedId[0]);
    let y = parseInt(clickedId[2]);

    let selectedBox = selected.x.toString() + " " + selected.y.toString();

    if (selected.x !== -1 && selected.y !== -1) 
        document.getElementById(selectedBox)!.className = document.getElementById(selectedBox)!.className.replace(/ selected/g, '');

    if (x === selected.x && y === selected.y) {
        selected.x = -1;
        selected.y = -1;
    } else {
        selected.x = x;
        selected.y = y;

        selectedBox = selected.x.toString() + " " + selected.y.toString();

        if (!document.getElementById(selectedBox)!.className.includes('selected'))
        document.getElementById(selectedBox)!.className += ' selected';
    }    
   
    console.log(selected);
};

window.onload = () => {
    wrong.x = [];
    wrong.y = [];
    wrong.block = [];
    
    generateGrid();
};

document.addEventListener('keydown', (event) => {
    if (selected.x === -1 && selected.y === -1)
        return;

    if (!event.key.match('([1-9])|Delete'))
        return;
    
    const selectedBox = selected.x.toString() + " " + selected.y.toString();

    if (event.key === 'Delete'){
        document.getElementById(selectedBox)!.innerHTML = '';
    } else {
        document.getElementById(selectedBox)!.innerHTML = event.key.toString();
    }

    checkBoard(selected.x, selected.y);
});

const checkBoard = (x: number, y: number) => {
    // check box
    let block = wrong.block;
    wrong.block = [];
    block.push(x);

    block.forEach(value => {
        let numbers = '';
        let input = document.getElementById(value.toString())?.innerHTML.split(/(?:)<.*?>/);

        input?.forEach(char => {
            if (char) {
                console.log(char)
                if (numbers.includes(char)) {
                    wrong.block.push(value);
                }

                numbers += char;
            }
        })
    });

    // check horizontal
    let xarr = wrong.x;
    wrong.x = [];
    xarr.push({x: Math.floor(x / 3) * 3, y: Math.floor(y / 3) * 3});    

    xarr.forEach(value => {
        let numbers = '';
        for (let i = 0; i !== 3; i++) {
            for (let j = 0; j !== 3; j++) {
                let content = document.getElementById(`${value.x + i} ${value.y + j}`)?.innerHTML;

                if (content){
                    if (numbers.includes(content)){
                        wrong.x.push({x: value.x, y: value.y});
                    }

                    numbers += content;
                }
            }
        }
    })

    // check vertical
    let yarr = wrong.y;
    wrong.y = [];
    yarr.push({x: x % 3, y: y % 3});

    yarr.forEach(value => {
        let numbers = '';

        for (let i = 0; i !== 3; i++)
            for (let j = 0; j !== 3; j++) {
                let content = document.getElementById(`${value.x + 3 * i} ${value.y + 3 * j}`)?.innerHTML;

                if (content) {
                    if (numbers.includes(content)){
                        wrong.y.push({x: value.x, y: value.y});
                    }

                    numbers += content;
                }
            }
    })

    updateWrongs();
}

const updateWrongs = () => {
    console.log(wrong);

    document.querySelectorAll('.wrong').forEach(item => {
        item.className = item.className.replace(/ wrong/g, ''); 
    });
    
    
    wrong.x.forEach(value => {
        for (let i = 0; i !== 3; i++){
            for (let j = 0; j !== 3; j++){
                document.getElementById(`${value.x + i} ${value.y + j}`)!.className += ' wrong';
            }
        }
    });

    wrong.y.forEach(value => {
        for (let i = 0; i !== 3; i++) {
            for (let j = 0; j !== 3; j++) {
                document.getElementById(`${value.x + i * 3} ${value.y + j * 3}`)!.className += ' wrong';
            }
        }
    })

    wrong.block.forEach(value => {
        document.getElementById(value.toString())!.className += ' wrong';
    })
}