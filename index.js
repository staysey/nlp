
'use strict';

const posTagger = require('wink-pos-tagger');

import {brill} from 'brill';
window.brill = brill;

var tagger = posTagger();


class Node {
	constructor(value){
		this.value = value;
		this.children = {};
		this.isLeaf = false;
		this.frequency = 0;
		this.part = 'none';
	}
}

class SuggestTree {
	constructor(){
		this.root = new Node(null);
	}
	
	async add(word){
		let newWord = false;
		if(word.includes('hgfdvbm')) {
			console.log(word)
			word = word.substring(0, word.length-7);
			newWord = true;
		}
		let pointer = this.root;
		for (let i = 0; i < word.length; i++) {
			if (!pointer.children[word[i]]) {
				pointer.children[word[i]] = new Node(word[i]);
			}
			pointer = pointer.children[word[i]];
		}
		pointer.isLeaf = true;
		if(newWord)pointer.frequency=0;
		else pointer.frequency++;
		//await $.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word).done(function(response){

		//	let ind = Math.floor(Math.random() * response[0].meanings.length);
		//	const { partOfSpeech, definitions } = response[0].meanings[ind];
		//	pointer.part = partOfSpeech;
   // }) 
       pointer.part  = tagger.tagSentence(word)[0].pos;
		pointer = this.root;
	}

	async addNew(word){
		let pointer = this.root;
		for (let i = 0; i < word.length; i++) {
			if (!pointer.children[word[i]]) {
				pointer.children[word[i]] = new Node(word[i]);
			}
			pointer = pointer.children[word[i]];
		}
		pointer.isLeaf = true;

		pointer.frequency=0;
		pointer.part  = tagger.tagSentence(word)[0].pos;
		pointer = this.root;
	}

	async addOldNode(word, fr){
		let pointer = this.root;
		for (let i = 0; i < word.length; i++) {
			if (!pointer.children[word[i]]) {
				pointer.children[word[i]] = new Node(word[i]);
			}
			pointer = pointer.children[word[i]];
		}
		pointer.isLeaf = true;

		pointer.frequency = fr;
		pointer.part  = tagger.tagSentence(word)[0].pos;
		pointer = this.root;
	}
	
	getDictionary(){
		const results = [];

		(function traverse(node, path, length) {

			if(!node){
				return
			};

			if(node.value){
				path[length++] = node.value;
			}

			if(node.isLeaf){
				let word = path.join("");
				results.push({ word: word, frequency: node.frequency, part: node.part })
			};
			
			Object.keys(node.children).forEach(key => {
				traverse(node.children[key], path.slice(), length);
			});
		}(this.root, [], 0));

		return results;
	}

	update(wordToUpdate, newWord){
		const results = new SuggestTree();
		let freq = 0;

		(function traverse(node, path, length) {

			if(!node){
				return
			};

			if(node.value){
				path[length++] = node.value;
			}

			if(node.isLeaf){
				let word = path.join("");
				if(newWord === word) freq += node.frequency;
				if(wordToUpdate === word) freq += node.frequency;
				if(wordToUpdate !== word && newWord !== word)  results.addOldNode(word, node.frequency);
			};
			
			Object.keys(node.children).forEach(key => {
				traverse(node.children[key], path.slice(), length);
			});
		}(this.root, [], 0));

		results.addOldNode(newWord, freq);
		return results;
	}

	delete(wordToDelete){
		const results = new SuggestTree();

		(function traverse(node, path, length) {

			if(!node){
				return
			};

			if(node.value){
				path[length++] = node.value;
			}

			if(node.isLeaf){
				let word = path.join("");
				if(wordToDelete !== word)
				results.addOldNode(word, node.frequency)
			};
			
			Object.keys(node.children).forEach(key => {
				traverse(node.children[key], path.slice(), length);
			});
		}(this.root, [], 0));

		return results;
	}
	
	getMatches(token, limit = 50, descending){
		let results = [],
			pointer = this.root,
			prefix = token.slice(0, token.length - 1);

		// If no token/token with no characters given, return empty array
		if (!token || !token.length) return results;

		// For loop to check if the token exists in the trie,
		// if not, returns empty array
		for (let i = 0; i < token.length; i++) {
			if (pointer.children[token[i]]) {
				pointer = pointer.children[token[i]];
			} else {
				return results;
			}
		}

		// IIFE which traverses trie and finds all matches(leaf nodes)
		(function traverse(node, path, length){
			if(!node){
				return
			};

			if(node.value){
				path[length++] = node.value;
			}

			if(node.isLeaf){
				let word = prefix + path.join("");
				results.push({ word: word, frequency: node.frequency, part: node.part })
			};
			
			Object.keys(node.children).forEach(key => {
				traverse(node.children[key], path.slice(), length);
			});
		}(pointer, [], 0));

		// return results.sort((a,b) => (
		// 	descending ? (b.frequency - a.frequency) : (a.frequency - b.frequency)
		// )).slice(0,limit);

		return results.slice(0,limit);
	}
}

//const DEFAULT_FILE = '../data/2072_words.txt';
const DEFAULT_FILE = '../data/text.txt';

console.log('Welcome to AutoCompleter');
console.log('Starting file scraper... ');


// Sample txt files used for testing purposes
const test = './data/test.txt';
const testExcerpt = './data/testExcerpt.txt';
const shakespeare = './data/shakespeare-complete.txt';

// Options object which specifies source file, number of results to display,
// and if results should be displaying in descending or ascending order.
const options = {
  file: DEFAULT_FILE,
  resultLimit: 10000000000000000,
  descending: false
};

let suggestTree = new SuggestTree();

const file = options.file || DEFAULT_FILE;
let filesArr = [];

const validWord = new RegExp(/[0-9\/#!$%\^&\*;{}=\_`~()]+/ig);
const validWord2 = new RegExp(/[0-9\/#!,.$%\^&\*;:{}=\_`~()]+/ig);
const trailingSymbol = /[.,!:=;?"]$/g;
const updateReg = /\s[.,?]*bno[.,?]*\s/g;
var pattern = /^([^0-9]*)$/;
let allData = '';
let filenames = [];
var selDiv = document.querySelector("#selectedFiles");
let allText = '';

document.querySelector("input[type=file]")
.addEventListener("change", function(event) {
  var files = event.target.files;
  for (var i = 0; i < files.length; i++) {
	selDiv.innerHTML += files[i].name + "<br/>";
	filenames.push(files[i].name);
    (function(file) {
		var reader = new FileReader();
      reader.addEventListener("load", function(e) {
		allData += `${ e.target.result }`;
		filesArr.push(e.target.result);
		var lines = e.target.result.split(/[\r\n]+/g);
		lines.forEach(function(line) {
			allText += line;
			line = line.trim();
				let words = line.split(' ');
					while(words.length > 0){
						let word = words.pop();
						word = word.replace(/[^\w\s]|_/g, "")
						.replace(/\s+/g, " ").toLowerCase();
						if(!validWord.test(word) && word!=='' && word.match(pattern)){
							suggestTree.add(word);	
									
						}
					}
				});
      });
      reader.readAsText(file)
    }(files[i]))
  }
})

const results_container = document.getElementsByClassName('results')[0];
const button = document.getElementsByClassName('button')[0];
const words_asc = document.getElementsByClassName('words-asc')[0];
const words_desc = document.getElementsByClassName('words-desc')[0];
const freq_asc = document.getElementsByClassName('freq-asc')[0];
const freq_desc = document.getElementsByClassName('freq-desc')[0];
const search = document.getElementsByClassName('search_icon')[0];
const add = document.getElementsByClassName('add')[0];
const update = document.getElementsByClassName('update')[0];
const deleteW = document.getElementsByClassName('delete')[0];
const uploadSubmit = document.getElementsByClassName('submit-upload')[0];
const upload = document.getElementsByClassName('upload-container')[0];
const buttons = document.getElementsByClassName('buttonContainer')[0];
const speech_parts = document.getElementsByClassName('speech_parts')[0];
const all_speech_parts_for_word = document.getElementsByClassName('all_speech_parts_for_word')[0];
const all_speech_parts_out = document.getElementsByClassName('all_speech_parts_out')[0];


uploadSubmit.addEventListener('click', async () => {
	while (upload.firstChild) {
        upload.removeChild(upload.firstChild);
    }
	document.getElementById('search').style.display = 'inline';
	buttons.style.display = 'flex';
});

function getUnique (arr) {
    var i = 0,
    current,
    length = arr.length,
    unique = [];
    for (; i < length; i++) {
      current = arr[i];
      if (!~unique.indexOf(current)) {
        unique.push(current);
      }
    }
    return unique;
  };

  all_speech_parts_out.addEventListener('click', async () => {
	while (results_container.firstChild) {
        results_container.removeChild(results_container.firstChild);
    }
	var data = document.getElementsByClassName('search_input')[0].value;
	data = data.toString().trim().toLowerCase();
	let wordPos = [];
	wordPos=brill[data];

	var table = document.createElement('table');
	var tr = document.createElement('tr');   
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
   
        var text1 = document.createTextNode(data);
		var allPos = '';
		for(let i=0; i<wordPos.length; i++){
          allPos += wordPos[i] + '         ';
		}
        var text2 = document.createTextNode(allPos);
	
   
        td1.appendChild(text1);
        td2.appendChild(text2);
	
        tr.appendChild(td1);
         tr.appendChild(td2);
	
        table.appendChild(tr);
		
			results_container.appendChild(table);
		
});


all_speech_parts_for_word.addEventListener('click', async () => {
	while (results_container.firstChild) {
        results_container.removeChild(results_container.firstChild);
    }
	let res = tagger.tagSentence(allText.toLowerCase());
	var data = document.getElementsByClassName('search_input')[0].value;
	data = data.toString().trim().toLowerCase();
	let wordPos = [];
	for(let i=0; i<res.length; i++){
          if(res[i].value === data) wordPos.push(res[i].pos);
	}
	wordPos = getUnique(wordPos);
	var table = document.createElement('table');
	var tr = document.createElement('tr');   
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
   
        var text1 = document.createTextNode(data);
		var allPos = '';
		for(let i=0; i<wordPos.length; i++){
          allPos += wordPos[i] + '         ';
		}
        var text2 = document.createTextNode(allPos);
	
   
        td1.appendChild(text1);
        td2.appendChild(text2);
	
        tr.appendChild(td1);
         tr.appendChild(td2);
	
        table.appendChild(tr);
		
			results_container.appendChild(table);
		
});

let speechParts = [];

speech_parts.addEventListener('click', async () => {
	while (results_container.firstChild) {
        results_container.removeChild(results_container.firstChild);
    }
	results_container.style.cssText = 'display: flex; width: 690px; flex-wrap: wrap;';
	let res = tagger.tagSentence(allText);
	for(let i=0; i<res.length; i++) {
		var p = document.createElement('p');
		p.style.cssText = 'margin-right: 3px';
		p.className='text';
		var text;
		var input = document.createElement('input');
		input.type = "text";
		if(!validWord2.test(res[i].value)){
			text = document.createTextNode(res[i].value);
			input.value = '_(' + res[i].pos  + ')_ ';
			input.style.cssText='width: 100px';
			p.appendChild(text);
			p.appendChild(input);

		}
		else {text = document.createTextNode(res[i].value + ' ');
		p.appendChild(text);
	}
		speechParts[i] = res[i].pos;
		
		
		 results_container.appendChild(p);
	}
    
    
});

freq_asc.addEventListener('click', async () => {

    let arr = suggestTree.getDictionary().sort(function(a, b){
		if (a.frequency < b.frequency) //сортируем строки по возрастанию
		  return -1
		if (a.frequency > b.frequency)
		  return 1
		return 0 // Никакой сортировки
		});
    while (results_container.firstChild) {
        results_container.removeChild(results_container.firstChild);
    }
	var table = document.createElement('table');
    arr.map((el) => {
        var tr = document.createElement('tr');   
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
   
        var text1 = document.createTextNode(el.word);
        var text2 = document.createTextNode(el.frequency);
		var text3 = document.createTextNode(el.part);
   
        td1.appendChild(text1);
        td2.appendChild(text2);
		td3.appendChild(text3);
   
        tr.appendChild(td1);
         tr.appendChild(td2);
		 tr.appendChild(td3);
        table.appendChild(tr);
    })
	results_container.appendChild(table);
});

freq_desc.addEventListener('click', async () => {
    let arr = suggestTree.getDictionary().sort(function(a, b){
		if (a.frequency > b.frequency) //сортируем строки по возрастанию
		  return -1
		if (a.frequency < b.frequency)
		  return 1
		return 0 // Никакой сортировки
		});
    while (results_container.firstChild) {
        results_container.removeChild(results_container.firstChild);
    }
	var table = document.createElement('table');
    arr.map((el) => {
        var tr = document.createElement('tr');   
        var td1 = document.createElement('td');
		td1.style.width = '150px';
		var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
   
        var text1 = document.createTextNode(el.word);
        var text2 = document.createTextNode(el.frequency);
		var text3 = document.createTextNode(el.part);
   
        td1.appendChild(text1);
        td2.appendChild(text2);
		td3.appendChild(text3);
   
        tr.appendChild(td1);
         tr.appendChild(td2);
		 tr.appendChild(td3);
		 table.appendChild(tr);
    })
	results_container.appendChild(table);
});

words_asc.addEventListener('click', async () => {
    let arr = suggestTree.getDictionary().sort(function(a, b){
		if (a.word < b.word) //сортируем строки по возрастанию
		  return -1
		if (a.word > b.word)
		  return 1
		return 0 // Никакой сортировки
		});
    while (results_container.firstChild) {
        results_container.removeChild(results_container.firstChild);
    }
	var table = document.createElement('table');
    arr.map((el) => {
        var tr = document.createElement('tr');   
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
   
        var text1 = document.createTextNode(el.word);
        var text2 = document.createTextNode(el.frequency);
		var text3 = document.createTextNode(el.part);
   
		td1.appendChild(text1);
        td2.appendChild(text2);
		td3.appendChild(text3);
   
        tr.appendChild(td1);
         tr.appendChild(td2);
		 tr.appendChild(td3);
        table.appendChild(tr);
    })
	results_container.appendChild(table);
});


words_desc.addEventListener('click', async () => {
    let arr = suggestTree.getDictionary().sort(function(a, b){
		if (a.word > b.word) //сортируем строки по возрастанию
		  return -1
		if (a.word < b.word)
		  return 1
		return 0 // Никакой сортировки
		});
    while (results_container.firstChild) {
        results_container.removeChild(results_container.firstChild);
    }
	var table = document.createElement('table');
    arr.map((el) => {
        var tr = document.createElement('tr');   
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
   
        var text1 = document.createTextNode(el.word);
        var text2 = document.createTextNode(el.frequency);
		var text3 = document.createTextNode(el.part);
   
		td1.appendChild(text1);
        td2.appendChild(text2);
		td3.appendChild(text3);
   
        tr.appendChild(td1);
         tr.appendChild(td2);
		 tr.appendChild(td3);
        table.appendChild(tr);
    })
	results_container.appendChild(table);
});

button.addEventListener('click', async () => {
    let arr = suggestTree.getDictionary();
    while (results_container.firstChild) {
        results_container.removeChild(results_container.firstChild);
    }
	var table = document.createElement('table');
    arr.map((el) => {
        var tr = document.createElement('tr');   
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
   
        var text1 = document.createTextNode(el.word);
        var text2 = document.createTextNode(el.frequency);
		var text3 = document.createTextNode(el.part);
   
        td1.appendChild(text1);
        td2.appendChild(text2);
		td3.appendChild(text3);
   
        tr.appendChild(td1);
         tr.appendChild(td2);
		 tr.appendChild(td3);
        table.appendChild(tr);
    })
	results_container.appendChild(table);
});

search.addEventListener('click', async () => {
    let arr = getResults(suggestTree, options);

while (results_container.firstChild) {
    results_container.removeChild(results_container.firstChild);
}
var table = document.createElement('table');
    arr.map((el) => {
		var tr = document.createElement('tr');   
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
   
        var text1 = document.createTextNode(el.word);
        var text2 = document.createTextNode(el.frequency);
		var text3 = document.createTextNode(el.part);
   
        td1.appendChild(text1);
        td2.appendChild(text2);
		td3.appendChild(text3);
   
        tr.appendChild(td1);
         tr.appendChild(td2);
		 tr.appendChild(td3);

        table.appendChild(tr);
    
    })
	results_container.appendChild(table);
});

add.addEventListener('click', async () => {
	 var data = document.getElementsByClassName('search_input')[0].value;
	 data = data.toString().trim().toLowerCase();
    suggestTree.addNew(data);
	allData+= '  ';
	allData+=`${data}_hgfdvbm`;

});

update.addEventListener('click', async () => {
	var data = document.getElementsByClassName('search_input')[0].value.split(" ");
   const newArr = suggestTree.update(data[0], data[1]);
   let re = new RegExp(`\\s[.,!:=;?"]*${data[0]}[.,!:=;?"]*\\s`, 'g'); 
   for(let i=0; i<filenames.length; i++){
	download(filesArr[i].toLowerCase().replaceAll(re,' '+  data[1] +' ' ), filenames[i],'txt' );
   }
   suggestTree = newArr;
   allData = allData.toLowerCase().replaceAll(re,' '+ data[1] + ' ');
});

var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var deleteAnyway = document.getElementsByClassName("deleteAnyway")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
	modal2.style.display = "none";
  }
  if (event.target == modal2) {
	modal2.style.display = "none";
  }
}

const tags = document.getElementsByClassName('tags')[0];

tags.onclick = function(event) {
	modal2.style.display = "block";
  
};

deleteAnyway.onclick = function(event) {
	var data = document.getElementsByClassName('search_input')[0].value;
 
	data = data.toString().trim().toLowerCase();

	let arr = suggestTree.delete(data);
    allData = allData.toLowerCase().replaceAll(new RegExp(`\\s[.,!:=;?"]*${data}[.,!:=;?"]*\\s`, 'g'), '_');
	suggestTree = arr;

	modal.style.display = "none";
  }

deleteW.addEventListener('click', async () => {
	modal.style.display = "block";


});
    
function getResults(tree, { resultLimit, descending }) {
 var data = document.getElementsByClassName('search_input')[0].value;
 
   data = data.toString().trim().toLowerCase();
 
   if (/[a-z]/.test(data)) {
     var results = tree.getMatches(data,resultLimit,descending);
     return results;
     var callback = getResults.bind(null,tree, { resultLimit, descending });
     closeQuery(callback);
   } else {
     stdout.write("Autocomplete only accepts letter characters\n");
     getResults(tree);
   }
 
}

function closeQuery(callback){
  var stdin = process.stdin, stdout = process.stdout;
  
  stdin.resume();
  stdout.write('Autocomplete again? (y/n)');

  stdin.once('data', data => {
    data = data.toString().trim().toLowerCase();
  
    if (data == 'y') {
      callback();
    } else {
      stdout.write('Thanks for using Autocomplete. Goodbye!');
      process.exit();
    }
  });
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

const save = document.getElementsByClassName('save')[0];

save.addEventListener('click', async () => {
	download(allData, 'my_dictionary.txt','txt' );
});