<script lang="ts">
    let board: number[][] = Array.from({length: 9}, () => (Array(9).fill(-1)));
    let selected = { x: -1, y: -1 };
    let wrongs : {x: number[], y: number[], block: number[]}= {x: [], y: [], block: []};

    let game = generateGame();
    
    while (!noWrongs()){
        game = generateGame();
    }

    removeTiles(60);
    console.log(possibleSolutions());

    function shuffleArray(array: number[]) : number[]{
        let ret : number[] = [...array];

        for (let i = ret.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ret[i], ret[j]] = [ret[j], ret[i]];
            
        }

        return ret;
    }

    function noWrongs() : boolean{
        return !wrongs.x.length && !wrongs.y.length && !wrongs.block.length;
    }

    function checkWrongs(x: number, y: number) : void {
        let tmp: Set<number> = new Set();

        // Y values
        wrongs.y.push(y);

        wrongs.y.forEach(num => {
                let list: number[] = [];
                for (let i = 0; i != 9; i++){
                    if (board[num][i] !== -1)
                        list.push(board[num][i]);
                }

                if (list.length !== new Set(list).size && list.length)
                    tmp.add(num);
            }
        );
        
        wrongs.y = Array.from(tmp);
        
        // X values
        tmp = new Set<number>();
        wrongs.x.push(x);
        
        wrongs.x.forEach(num => {
            let line: number[] = [];
            for (let i = 0; i != 9; i++) {
                if (board[i][num] === -1)
                    continue;
                line.push(board[i][num]);
            }

            if (line.length !== new Set(line).size && line.length)
                tmp.add(num);
        });

        wrongs.x = Array.from(tmp);
        
        // blocks
        tmp = new Set<number>();
        wrongs.block.push(Math.floor(x / 3) + 3 * Math.floor(y / 3));
        
        wrongs.block.forEach(num => {
            let xDis = (num % 3) * 3;
            let yDis = Math.floor(num / 3) * 3;
            let cBlock : number[] = []

            for (let i = 0; i != 3; i++) {
                for (let j = 0; j != 3; j++) {
                    if (board[yDis + i][xDis + j] !== -1)
                        cBlock.push(board[yDis + i][xDis + j]);
                }
            }


            if (cBlock.length !== new Set(cBlock).size && cBlock.length)
                tmp.add(num);
        });

        wrongs.block = Array.from(tmp);
    }

    function emptySpot() : {x: number, y: number} {
        for (let i = 0; i != board.length; i++) 
            for (let j = 0; j != board.length; j++) 
                if (board[i][j] === -1)
                    return {x: j, y: i};

        return {x: -1, y: -1};
    }

    function generateGame() : boolean {
        const empty = emptySpot();

        if (empty.x === -1)
            return true;
        
        let numbers: number[] = [1,2,3,4,5,6,7,8,9];
        numbers = shuffleArray(numbers);

        let done = false;
       
        for (let i = 0; i != numbers.length; i++) {
            board[empty.y][empty.x] = numbers[i];
            checkWrongs(empty.x, empty.y);
            
            if (!noWrongs())
                continue;

            done = generateGame();

            if (done)
                return true;
        }

        board[empty.y][empty.x] = -1;
        return false;
    }

    function possibleSolutions () : number {
        const empty = emptySpot();

        if (empty.x === -1)
            return 1;
        
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let sum = 0;

        for (const num of numbers) {
            board[empty.y][empty.x] = num;
            checkWrongs(empty.x, empty.y);

            if (noWrongs())
                sum += possibleSolutions();
        }

        board[empty.y][empty.x] = -1;
        checkWrongs(empty.x, empty.y);

        return sum;
    }

    function removeTiles(iterator: number) {
        if (iterator === 0)
            return;

        do { 
            let x : number;
            let y : number;
            do {
                [x, y] = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
            } while (board[y][x] === -1);

            let val = board[y][x];
            board[y][x] = -1;

            if (possibleSolutions() === 1){
                removeTiles(iterator - 1);
                return;
            }

            board[y][x] = val;
        } while (possibleSolutions() !== 1);
    }


    function keyPressed(e: KeyboardEvent) : void{
        if (selected.x === -1 && selected.y === -1)
            return;

        if (e.key === 'Escape') {
            selected.x = -1;
            selected.y = -1;
        } else if (e.key === 'Backspace') {
            board[selected.y][selected.x] = -1;
            checkWrongs(selected.x, selected.y);
        } else if (e.key >= '0' && e.key <= '9'){
            board[selected.y][selected.x] = parseInt(e.key)
            checkWrongs(selected.x, selected.y);
        } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].some(x => x === e.key)) {
            switch (e.key) {
                case 'ArrowLeft':
                    if (selected.x != 0)
                        selected.x--;
                break;
                case 'ArrowRight':
                    if (selected.x != 8)
                        selected.x++;
                break;
                case 'ArrowUp':
                    if (selected.y != 0)
                        selected.y--;
                break;
                case 'ArrowDown':
                    if (selected.y != 8)
                        selected.y++;
                break;
            }
        } 
    } 

    function clicked(x: number, y: number) {
        if (selected.x === x && selected.y === y) {
            selected.x = -1;
            selected.y = -1;
        } else {
            selected.x = x;
            selected.y = y;
        }
    }
</script>

<svelte:window on:keydown|prevent_default={keyPressed} on:load={() => generateGame()}/>

<div class="board" on:load={generateGame}>
    {#each board as row, y}
        <div class="row">
            {#each row as block, x}
                <button
                    class="block"
                    on:click={() => clicked(x, y)}
                    class:highlight={selected.x === x || selected.y === y}
                    class:selected={selected.x === x && selected.y ===  y}
                    class:wrong={wrongs.x.some(num => num === x) ||
                                 wrongs.y.some(num => num === y) || 
                                 wrongs.block.some(num => num === (Math.floor(x / 3) + 3 * Math.floor(y / 3)))}
                >
                    {board[y][x] === -1 ? " " : board[y][x]}
                </button>
            {/each}
        </div>
    {/each}
</div>
