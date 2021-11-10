
'use strict';

const posTagger = require('wink-pos-tagger');
import Lemmatizer from './javascript-lemmatizer-master/js/lemmatizer.js';
var lemmatizer2 = new Lemmatizer();
console.log(lemmatizer2.lemmas('desks'));
import {lemmatizer} from "lemmatizer";

let changeTag = [];
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
		this.lemma=[];
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
       //pointer.lemmapart  = tagger.tagSentence(lemmatizer(word))[0].pos;
	   
	   let wordPos = [];
	    wordPos=brill[word];
		var allPos = '';
		if(wordPos) {
		for(let i=0; i<wordPos.length; i++){
			if (wordPos[i])
          allPos += wordPos[i] + ', ';
		}
		allPos = allPos.replace(/,\s*$/, "");
		pointer.part  = allPos;
	}
	else 
		pointer.part  = tagger.tagSentence(word)[0].pos;
		const allLemmas = lemmatizer2.lemmas(word);

		for(let i=0; i<allLemmas.length; i++) {
         if(allLemmas[i][1]==='verb') allLemmas[i][1]='VB';
		 if(allLemmas[i][1]==='adj') allLemmas[i][1]='JJ';
		 if(allLemmas[i][1]==='noun') allLemmas[i][1]='NN';
		 if(allLemmas[i][1]==='adv') allLemmas[i][1]='RB';
		 if(allLemmas[i][1]==='') allLemmas[i][1]=tagger.tagSentence(lemmatizer(allLemmas[i][0]))[0].pos;

	}
	pointer.lemma=allLemmas;
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
		
		//pointer.lemmapart  = tagger.tagSentence(lemmatizer(word))[0].pos;
		let wordPos = [];
		wordPos=brill[word];
			var allPos = '';
			if(wordPos) {
			for(let i=0; i<wordPos.length; i++){
				if (wordPos[i])
			  allPos += wordPos[i] + ', ';
			}
			allPos = allPos.replace(/,\s*$/, "");
			pointer.part  = allPos;
		}
			else pointer.part  = tagger.tagSentence(word)[0].pos;
			const allLemmas = lemmatizer2.lemmas(word);

			for(let i=0; i<allLemmas.length; i++) {
			 if(allLemmas[i][1]==='verb') allLemmas[i][1]='VB';
			 if(allLemmas[i][1]==='adj') allLemmas[i][1]='JJ';
			 if(allLemmas[i][1]==='noun') allLemmas[i][1]='NN';
			 if(allLemmas[i][1]==='adv') allLemmas[i][1]='RB';
			 if(allLemmas[i][1]==='') allLemmas[i][1]=tagger.tagSentence(lemmatizer(allLemmas[i][0]))[0].pos;
	
		}
		pointer.lemma=allLemmas;

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
		//pointer.lemmapart  = tagger.tagSentence(lemmatizer(word))[0].pos;
		
		let wordPos = [];
		wordPos=brill[word];
			var allPos = '';
			if(wordPos) {
			for(let i=0; i<wordPos.length; i++){
				if (wordPos[i])
			  allPos += wordPos[i] + ', ';
			}
			allPos = allPos.replace(/,\s*$/, "");
			pointer.part  = allPos;
		}
			
			else pointer.part  = tagger.tagSentence(word)[0].pos;
			const allLemmas = lemmatizer2.lemmas(word);

		for(let i=0; i<allLemmas.length; i++) {
         if(allLemmas[i][1]==='verb') allLemmas[i][1]='VB';
		 if(allLemmas[i][1]==='adj') allLemmas[i][1]='JJ';
		 if(allLemmas[i][1]==='noun') allLemmas[i][1]='NN';
		 if(allLemmas[i][1]==='adv') allLemmas[i][1]='RB';
		 if(allLemmas[i][1]==='') allLemmas[i][1]=tagger.tagSentence(lemmatizer(allLemmas[i][0]))[0].pos;
	}
	pointer.lemma=allLemmas;
		pointer = this.root;
	}
	
	async addOldNode2(word, fr, allTags, baseForm){
		let pointer = this.root;
		for (let i = 0; i < word.length; i++) {
			if (!pointer.children[word[i]]) {
				pointer.children[word[i]] = new Node(word[i]);
			}
			pointer = pointer.children[word[i]];
		}
		pointer.isLeaf = true;

		pointer.frequency = fr;
		pointer.part  = allTags;
		pointer.lemma = baseForm;
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
				results.push({ word: word, frequency: node.frequency, part: node.part, lemma: node.lemma, lemmapart: node.lemmapart })
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

	updateAllTags(wordToUpdate, newTags){
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
				if(wordToUpdate === word) results.addOldNode2(word, node.frequency, newTags, node.lemma);
				if(wordToUpdate !== word)  results.addOldNode2(word, node.frequency, node.part, node.lemma);
			};
			
			Object.keys(node.children).forEach(key => {
				traverse(node.children[key], path.slice(), length);
			});
		}(this.root, [], 0));

		return results;
	}

	updateBaseTag(wordToUpdate, newBaseTag, num){
		console.log('num', num)
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
				if(wordToUpdate === word) {
					let newLemma = [];
					for(let i=0; i<node.lemma.length; i++){
						if(i===num) {
							newLemma[i] =[];
							newLemma[i][0] = node.lemma[i][0];
							newLemma[i][1] = newBaseTag;
						}
						else {
							newLemma[i] =[];
							newLemma[i][0] = node.lemma[i][0];
							newLemma[i][1] = node.lemma[i][1];
						}
					}
					console.log('neeew', newLemma);
					results.addOldNode2(word, node.frequency, node.part, newLemma);
				}
					
				else results.addOldNode2(word, node.frequency, node.part, node.lemma);
			};
			
			Object.keys(node.children).forEach(key => {
				traverse(node.children[key], path.slice(), length);
			});
		}(this.root, [], 0));

		return results;
	}

	updateBaseForm(wordToUpdate, newBaseForm, num){
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
				if(wordToUpdate === word) {
					let newLemma = [];
					for(let i=0; i<node.lemma.length; i++){
						if(i===num) {
							newLemma[i] =[];
							newLemma[i][0] = newBaseForm;
							newLemma[i][1] = node.lemma[i][1];
						}
						else {
							newLemma[i] =[];
							newLemma[i][0] = node.lemma[i][0];
							newLemma[i][1] = node.lemma[i][1];
						}
					}
					results.addOldNode2(word, node.frequency, node.part, newLemma);
				}
					
				else results.addOldNode2(word, node.frequency, node.part, node.lemma);
			};
			
			Object.keys(node.children).forEach(key => {
				traverse(node.children[key], path.slice(), length);
			});
		}(this.root, [], 0));

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
				results.push({ word: word, frequency: node.frequency, part: node.part, lemma: node.lemma, lemmapart: node.lemmapart })
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
const inner_table = document.getElementsByClassName('inner_table')[0];



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
let all_word_s = [];

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
			let val = '';
			for(let J=0; J<changeTag.length; J++){
				if(changeTag[J][0].toString().trim().toLowerCase() === res[i].value.toString().trim().toLowerCase()
				 && changeTag[J][1] === speechParts[i]) {
					val = changeTag[J][2];
					changeTag[J][0] = ',';
					break;
				}
		  }
		  if(val) input.value = val;
			else input.value = '_(' + res[i].pos  + ')_ ';
			input.className='input_value';
			input.style.cssText='width: 100px';
			p.appendChild(text);
			p.appendChild(input);
			speechParts[i] = res[i].pos;
			all_word_s[i] = res[i].value;
		}
		else {text = document.createTextNode(res[i].value + ' ');
		p.appendChild(text);
	    }
	   
		 results_container.appendChild(p);
	}
    var child = document.getElementsByClassName('input_value');
	for(let i=0; i<child.length; i++) {
		child[i].addEventListener('change', async (e) => {
			var data = document.getElementsByClassName('input_value')[i].value;
			let res=[];
			res[0] = all_word_s[i];
			res[1] = speechParts[i];
			res[2] = data;
			changeTag.push(res);
		})
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
	while (inner_table.firstChild) {
		inner_table.removeChild(inner_table.firstChild);
	}
	var table = document.createElement('table');
	var tr2 = document.createElement('tr');  
		var te = document.createTextNode('word');
		var th = document.createElement('th');
		var te2 = document.createTextNode('frequency');
		var th2 = document.createElement('th');
		var te3 = document.createTextNode('tags');
		var th3 = document.createElement('th');
		th.appendChild(te);
		tr2.appendChild(th);
		th2.appendChild(te2);
		tr2.appendChild(th2);
		th3.appendChild(te3);
		tr2.appendChild(th3);
		table.appendChild(tr2);
    arr.map((el) => {
        var tr = document.createElement('tr');  
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
		td3.style.width = '100px';

        var text1 = document.createTextNode(el.word);
        var text2 = document.createTextNode(el.frequency);
		var input1 = document.createElement('textarea');
		input1.className = 'input1';
		input1.value = el.part;
   
        td1.appendChild(text1);
        td2.appendChild(text2);
		td3.appendChild(input1);

   
        tr.appendChild(td1);
         tr.appendChild(td2);
		 tr.appendChild(td3);


        table.appendChild(tr);
    })
	results_container.appendChild(table);
	var trs = table.children;
	for (let j=0; j<trs.length; j++) {
		let tds = trs[j].children;
		tds[0].addEventListener('click', async (e) => {
		   while (inner_table.firstChild) {
			inner_table.removeChild(inner_table.firstChild);
		}
		   var in_table = document.createElement('table');
		   in_table.className='innertable';
		   var tr2 = document.createElement('tr');  
			   var te = document.createTextNode('base form');
			   var th = document.createElement('th');
			   var te2 = document.createTextNode('tags');
			   var th2 = document.createElement('th');
			   th.appendChild(te);
			   tr2.appendChild(th);
			   th2.appendChild(te2);
			   tr2.appendChild(th2);
			   in_table.appendChild(tr2);
			   let arr = suggestTree.getDictionary();
			   console.log('ARRRRRRR', arr)
			   arr.map((el) => {
			   if(el.word === tds[0].textContent) {
				for(let i=0; i<el.lemma.length; i++){
					let tr3 = document.createElement('tr');  
					let td1 = document.createElement('td');
					let td2 = document.createElement('td');
					let input3 = document.createElement('textarea');
					input3.className = 'input3';
					input3.value = el.lemma[i][0];
					let input2 = document.createElement('textarea');
					input2.className = 'input2';
					input2.value = el.lemma[i][1];
					td1.appendChild(input3);
					td2.appendChild(input2);
					tr3.appendChild(td1);
					 tr3.appendChild(td2);
					 in_table.appendChild(tr3);
				}
			}
		   })
		   var span = document.createElement('span');
		   var p = document.createElement('span');
		   p.className = 'title';
		   var textt1 = document.createTextNode('All base forms for word: ');
		   var textt = document.createTextNode(tds[0].textContent);
		   span.appendChild(textt1);
		   p.appendChild(textt);
		   inner_table.appendChild(span);
		   inner_table.appendChild(p);
		   inner_table.appendChild(in_table);
		})
		for (let i=0; i<tds.length; i++) {
			tds[i].addEventListener('change', async (e) => {
				var data = tds[i].children[0].value;
				let newArr = [];
				if(i===2) newArr = suggestTree.updateAllTags(tds[0].textContent, data);
			//	if(i===4) newArr = suggestTree.updateBaseTag(tds[0].textContent, data);
			//	if(i===3) newArr = suggestTree.updateBaseForm(tds[0].textContent, data);
				suggestTree = newArr;
			})
	   }
	}

	inner_table.addEventListener('click', async (e) => {
	var inner_trs = inner_table.children;
	inner_trs= inner_trs[2].children;
	for (let j=0; j<inner_trs.length; j++) {
	 let inner_tds = inner_trs[j].children;
		for(let i=0; i<inner_tds.length; i++) {
		 inner_tds[i].addEventListener('change', async (e) => {
			 var data = inner_tds[i].children[0].value;
			 let newArr = [];
			 if(i===1) newArr = suggestTree.updateBaseTag(document.getElementsByClassName('title')[0].textContent, data, j-1);
			 if(i===0) newArr = suggestTree.updateBaseForm(document.getElementsByClassName('title')[0].textContent, data, j-1);
			 suggestTree = newArr;
			 console.log(suggestTree)
		 })
		}
	 }
	})
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
	while (inner_table.firstChild) {
		inner_table.removeChild(inner_table.firstChild);
	}
	var table = document.createElement('table');
	var tr2 = document.createElement('tr');  
		var te = document.createTextNode('word');
		var th = document.createElement('th');
		var te2 = document.createTextNode('frequency');
		var th2 = document.createElement('th');
		var te3 = document.createTextNode('tags');
		var th3 = document.createElement('th');
		th.appendChild(te);
		tr2.appendChild(th);
		th2.appendChild(te2);
		tr2.appendChild(th2);
		th3.appendChild(te3);
		tr2.appendChild(th3);
		table.appendChild(tr2);
    arr.map((el) => {
        var tr = document.createElement('tr');  
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
		td3.style.width = '100px';

        var text1 = document.createTextNode(el.word);
        var text2 = document.createTextNode(el.frequency);
		var input1 = document.createElement('textarea');
		input1.className = 'input1';
		input1.value = el.part;
   
        td1.appendChild(text1);
        td2.appendChild(text2);
		td3.appendChild(input1);

   
        tr.appendChild(td1);
         tr.appendChild(td2);
		 tr.appendChild(td3);


        table.appendChild(tr);
    })
	results_container.appendChild(table);
	var trs = table.children;
	for (let j=0; j<trs.length; j++) {
		let tds = trs[j].children;
		tds[0].addEventListener('click', async (e) => {
		   while (inner_table.firstChild) {
			inner_table.removeChild(inner_table.firstChild);
		}
		   var in_table = document.createElement('table');
		   in_table.className='innertable';
		   var tr2 = document.createElement('tr');  
			   var te = document.createTextNode('base form');
			   var th = document.createElement('th');
			   var te2 = document.createTextNode('tags');
			   var th2 = document.createElement('th');
			   th.appendChild(te);
			   tr2.appendChild(th);
			   th2.appendChild(te2);
			   tr2.appendChild(th2);
			   in_table.appendChild(tr2);
			   let arr = suggestTree.getDictionary();
			   console.log('ARRRRRRR', arr)
			   arr.map((el) => {
			   if(el.word === tds[0].textContent) {
				for(let i=0; i<el.lemma.length; i++){
					let tr3 = document.createElement('tr');  
					let td1 = document.createElement('td');
					let td2 = document.createElement('td');
					let input3 = document.createElement('textarea');
					input3.className = 'input3';
					input3.value = el.lemma[i][0];
					let input2 = document.createElement('textarea');
					input2.className = 'input2';
					input2.value = el.lemma[i][1];
					td1.appendChild(input3);
					td2.appendChild(input2);
					tr3.appendChild(td1);
					 tr3.appendChild(td2);
					 in_table.appendChild(tr3);
				}
			}
		   })
		   var span = document.createElement('span');
		   var p = document.createElement('span');
		   p.className = 'title';
		   var textt1 = document.createTextNode('All base forms for word: ');
		   var textt = document.createTextNode(tds[0].textContent);
		   span.appendChild(textt1);
		   p.appendChild(textt);
		   inner_table.appendChild(span);
		   inner_table.appendChild(p);
		   inner_table.appendChild(in_table);
		})
		for (let i=0; i<tds.length; i++) {
			tds[i].addEventListener('change', async (e) => {
				var data = tds[i].children[0].value;
				let newArr = [];
				if(i===2) newArr = suggestTree.updateAllTags(tds[0].textContent, data);
			//	if(i===4) newArr = suggestTree.updateBaseTag(tds[0].textContent, data);
			//	if(i===3) newArr = suggestTree.updateBaseForm(tds[0].textContent, data);
				suggestTree = newArr;
			})
	   }
	}

	inner_table.addEventListener('click', async (e) => {
	var inner_trs = inner_table.children;
	inner_trs= inner_trs[2].children;
	for (let j=0; j<inner_trs.length; j++) {
	 let inner_tds = inner_trs[j].children;
		for(let i=0; i<inner_tds.length; i++) {
		 inner_tds[i].addEventListener('change', async (e) => {
			 var data = inner_tds[i].children[0].value;
			 let newArr = [];
			 if(i===1) newArr = suggestTree.updateBaseTag(document.getElementsByClassName('title')[0].textContent, data, j-1);
			 if(i===0) newArr = suggestTree.updateBaseForm(document.getElementsByClassName('title')[0].textContent, data, j-1);
			 suggestTree = newArr;
			 console.log(suggestTree)
		 })
		}
	 }
	})
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
	while (inner_table.firstChild) {
		inner_table.removeChild(inner_table.firstChild);
	}
	var table = document.createElement('table');
	var tr2 = document.createElement('tr');  
		var te = document.createTextNode('word');
		var th = document.createElement('th');
		var te2 = document.createTextNode('frequency');
		var th2 = document.createElement('th');
		var te3 = document.createTextNode('tags');
		var th3 = document.createElement('th');
		th.appendChild(te);
		tr2.appendChild(th);
		th2.appendChild(te2);
		tr2.appendChild(th2);
		th3.appendChild(te3);
		tr2.appendChild(th3);
		table.appendChild(tr2);
    arr.map((el) => {
        var tr = document.createElement('tr');  
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
		td3.style.width = '100px';

        var text1 = document.createTextNode(el.word);
        var text2 = document.createTextNode(el.frequency);
		var input1 = document.createElement('textarea');
		input1.className = 'input1';
		input1.value = el.part;
   
        td1.appendChild(text1);
        td2.appendChild(text2);
		td3.appendChild(input1);

   
        tr.appendChild(td1);
         tr.appendChild(td2);
		 tr.appendChild(td3);


        table.appendChild(tr);
    })
	results_container.appendChild(table);
	var trs = table.children;
	for (let j=0; j<trs.length; j++) {
		let tds = trs[j].children;
		tds[0].addEventListener('click', async (e) => {
		   while (inner_table.firstChild) {
			inner_table.removeChild(inner_table.firstChild);
		}
		   var in_table = document.createElement('table');
		   in_table.className='innertable';
		   var tr2 = document.createElement('tr');  
			   var te = document.createTextNode('base form');
			   var th = document.createElement('th');
			   var te2 = document.createTextNode('tags');
			   var th2 = document.createElement('th');
			   th.appendChild(te);
			   tr2.appendChild(th);
			   th2.appendChild(te2);
			   tr2.appendChild(th2);
			   in_table.appendChild(tr2);
			   let arr = suggestTree.getDictionary();
			   console.log('ARRRRRRR', arr)
			   arr.map((el) => {
			   if(el.word === tds[0].textContent) {
				for(let i=0; i<el.lemma.length; i++){
					let tr3 = document.createElement('tr');  
					let td1 = document.createElement('td');
					let td2 = document.createElement('td');
					let input3 = document.createElement('textarea');
					input3.className = 'input3';
					input3.value = el.lemma[i][0];
					let input2 = document.createElement('textarea');
					input2.className = 'input2';
					input2.value = el.lemma[i][1];
					td1.appendChild(input3);
					td2.appendChild(input2);
					tr3.appendChild(td1);
					 tr3.appendChild(td2);
					 in_table.appendChild(tr3);
				}
			}
		   })
		   var span = document.createElement('span');
		   var p = document.createElement('span');
		   p.className = 'title';
		   var textt1 = document.createTextNode('All base forms for word: ');
		   var textt = document.createTextNode(tds[0].textContent);
		   span.appendChild(textt1);
		   p.appendChild(textt);
		   inner_table.appendChild(span);
		   inner_table.appendChild(p);
		   inner_table.appendChild(in_table);
		})
		for (let i=0; i<tds.length; i++) {
			tds[i].addEventListener('change', async (e) => {
				var data = tds[i].children[0].value;
				let newArr = [];
				if(i===2) newArr = suggestTree.updateAllTags(tds[0].textContent, data);
			//	if(i===4) newArr = suggestTree.updateBaseTag(tds[0].textContent, data);
			//	if(i===3) newArr = suggestTree.updateBaseForm(tds[0].textContent, data);
				suggestTree = newArr;
			})
	   }
	}

	inner_table.addEventListener('click', async (e) => {
	var inner_trs = inner_table.children;
	inner_trs= inner_trs[2].children;
	for (let j=0; j<inner_trs.length; j++) {
	 let inner_tds = inner_trs[j].children;
		for(let i=0; i<inner_tds.length; i++) {
		 inner_tds[i].addEventListener('change', async (e) => {
			 var data = inner_tds[i].children[0].value;
			 let newArr = [];
			 if(i===1) newArr = suggestTree.updateBaseTag(document.getElementsByClassName('title')[0].textContent, data, j-1);
			 if(i===0) newArr = suggestTree.updateBaseForm(document.getElementsByClassName('title')[0].textContent, data, j-1);
			 suggestTree = newArr;
			 console.log(suggestTree)
		 })
		}
	 }
	})
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
	while (inner_table.firstChild) {
		inner_table.removeChild(inner_table.firstChild);
	}
	var table = document.createElement('table');
	var tr2 = document.createElement('tr');  
		var te = document.createTextNode('word');
		var th = document.createElement('th');
		var te2 = document.createTextNode('frequency');
		var th2 = document.createElement('th');
		var te3 = document.createTextNode('tags');
		var th3 = document.createElement('th');
		th.appendChild(te);
		tr2.appendChild(th);
		th2.appendChild(te2);
		tr2.appendChild(th2);
		th3.appendChild(te3);
		tr2.appendChild(th3);
		table.appendChild(tr2);
	arr.map((el) => {
		var tr = document.createElement('tr');  
		var td1 = document.createElement('td');
		td1.style.width = '150px';
		var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
		td3.style.width = '100px';
	
		var text1 = document.createTextNode(el.word);
		var text2 = document.createTextNode(el.frequency);
		var input1 = document.createElement('textarea');
		input1.className = 'input1';
		input1.value = el.part;
	
		td1.appendChild(text1);
		td2.appendChild(text2);
		td3.appendChild(input1);
	
	
		tr.appendChild(td1);
		 tr.appendChild(td2);
		 tr.appendChild(td3);
	
	
		table.appendChild(tr);
	})
	results_container.appendChild(table);
	var trs = table.children;
	for (let j=0; j<trs.length; j++) {
		let tds = trs[j].children;
		tds[0].addEventListener('click', async (e) => {
		   while (inner_table.firstChild) {
			inner_table.removeChild(inner_table.firstChild);
		}
		   var in_table = document.createElement('table');
		   in_table.className='innertable';
		   var tr2 = document.createElement('tr');  
			   var te = document.createTextNode('base form');
			   var th = document.createElement('th');
			   var te2 = document.createTextNode('tags');
			   var th2 = document.createElement('th');
			   th.appendChild(te);
			   tr2.appendChild(th);
			   th2.appendChild(te2);
			   tr2.appendChild(th2);
			   in_table.appendChild(tr2);
			   let arr = suggestTree.getDictionary();
			   arr.map((el) => {
			   if(el.word === tds[0].textContent) {
				for(let i=0; i<el.lemma.length; i++){
					let tr3 = document.createElement('tr');  
					let td1 = document.createElement('td');
					let td2 = document.createElement('td');
					let input3 = document.createElement('textarea');
					input3.className = 'input3';
					input3.value = el.lemma[i][0];
					let input2 = document.createElement('textarea');
					input2.className = 'input2';
					input2.value = el.lemma[i][1];
					td1.appendChild(input3);
					td2.appendChild(input2);
					tr3.appendChild(td1);
					 tr3.appendChild(td2);
					 in_table.appendChild(tr3);
				}
			}
		   })
		   var span = document.createElement('span');
		   var p = document.createElement('span');
		   p.className = 'title';
		   var textt1 = document.createTextNode('All base forms for word: ');
		   var textt = document.createTextNode(tds[0].textContent);
		   span.appendChild(textt1);
		   p.appendChild(textt);
		   inner_table.appendChild(span);
		   inner_table.appendChild(p);
		   inner_table.appendChild(in_table);
		})
		for (let i=0; i<tds.length; i++) {
			tds[i].addEventListener('change', async (e) => {
				var data = tds[i].children[0].value;
				let newArr = [];
				if(i===2) newArr = suggestTree.updateAllTags(tds[0].textContent, data);
			//	if(i===4) newArr = suggestTree.updateBaseTag(tds[0].textContent, data);
			//	if(i===3) newArr = suggestTree.updateBaseForm(tds[0].textContent, data);
				suggestTree = newArr;
			})
	   }
	}
	
	inner_table.addEventListener('click', async (e) => {
	var inner_trs = inner_table.children;
	inner_trs= inner_trs[2].children;
	for (let j=0; j<inner_trs.length; j++) {
	 let inner_tds = inner_trs[j].children;
		for(let i=0; i<inner_tds.length; i++) {
		 inner_tds[i].addEventListener('change', async (e) => {
			 var data = inner_tds[i].children[0].value;
			 let newArr = [];
			 if(i===1) newArr = suggestTree.updateBaseTag(document.getElementsByClassName('title')[0].textContent, data, j-1);
			 if(i===0) newArr = suggestTree.updateBaseForm(document.getElementsByClassName('title')[0].textContent, data, j-1);
			 suggestTree = newArr;
			 console.log(suggestTree)
		 })
		}
	 }
	})

});

button.addEventListener('click', async () => {
    let arr = suggestTree.getDictionary();
    while (results_container.firstChild) {
        results_container.removeChild(results_container.firstChild);
    }
	while (inner_table.firstChild) {
		inner_table.removeChild(inner_table.firstChild);
	}
	var table = document.createElement('table');
	var tr2 = document.createElement('tr');  
		var te = document.createTextNode('word');
		var th = document.createElement('th');
		var te2 = document.createTextNode('frequency');
		var th2 = document.createElement('th');
		var te3 = document.createTextNode('tags');
		var th3 = document.createElement('th');
		th.appendChild(te);
		tr2.appendChild(th);
		th2.appendChild(te2);
		tr2.appendChild(th2);
		th3.appendChild(te3);
		tr2.appendChild(th3);
		table.appendChild(tr2);
    arr.map((el) => {
        var tr = document.createElement('tr');  
        var td1 = document.createElement('td');
		td1.style.width = '150px';
        var td2 = document.createElement('td');
		td2.style.width = '100px';
		var td3 = document.createElement('td');
		td3.style.width = '100px';

        var text1 = document.createTextNode(el.word);
        var text2 = document.createTextNode(el.frequency);
		var input1 = document.createElement('textarea');
		input1.className = 'input1';
		input1.value = el.part;
   
        td1.appendChild(text1);
        td2.appendChild(text2);
		td3.appendChild(input1);

   
        tr.appendChild(td1);
         tr.appendChild(td2);
		 tr.appendChild(td3);


        table.appendChild(tr);
    })
	results_container.appendChild(table);
	var trs = table.children;
	for (let j=0; j<trs.length; j++) {
		let tds = trs[j].children;
		tds[0].addEventListener('click', async (e) => {
		   while (inner_table.firstChild) {
			inner_table.removeChild(inner_table.firstChild);
		}
		   var in_table = document.createElement('table');
		   in_table.className='innertable';
		   var tr2 = document.createElement('tr');  
			   var te = document.createTextNode('base form');
			   var th = document.createElement('th');
			   var te2 = document.createTextNode('tags');
			   var th2 = document.createElement('th');
			   th.appendChild(te);
			   tr2.appendChild(th);
			   th2.appendChild(te2);
			   tr2.appendChild(th2);
			   in_table.appendChild(tr2);
			   let arr = suggestTree.getDictionary();
			   console.log('ARRRRRRR', arr)
			   arr.map((el) => {
			   if(el.word === tds[0].textContent) {
				for(let i=0; i<el.lemma.length; i++){
					let tr3 = document.createElement('tr');  
					let td1 = document.createElement('td');
					let td2 = document.createElement('td');
					let input3 = document.createElement('textarea');
					input3.className = 'input3';
					input3.value = el.lemma[i][0];
					let input2 = document.createElement('textarea');
					input2.className = 'input2';
					input2.value = el.lemma[i][1];
					td1.appendChild(input3);
					td2.appendChild(input2);
					tr3.appendChild(td1);
					 tr3.appendChild(td2);
					 in_table.appendChild(tr3);
				}
			}
		   })
		   var span = document.createElement('span');
		   var p = document.createElement('span');
		   p.className = 'title';
		   var textt1 = document.createTextNode('All base forms for word: ');
		   var textt = document.createTextNode(tds[0].textContent);
		   span.appendChild(textt1);
		   p.appendChild(textt);
		   inner_table.appendChild(span);
		   inner_table.appendChild(p);
		   inner_table.appendChild(in_table);
		})
		for (let i=0; i<tds.length; i++) {
			tds[i].addEventListener('change', async (e) => {
				var data = tds[i].children[0].value;
				let newArr = [];
				if(i===2) newArr = suggestTree.updateAllTags(tds[0].textContent, data);
			//	if(i===4) newArr = suggestTree.updateBaseTag(tds[0].textContent, data);
			//	if(i===3) newArr = suggestTree.updateBaseForm(tds[0].textContent, data);
				suggestTree = newArr;
			})
	   }
	}

	inner_table.addEventListener('click', async (e) => {
	var inner_trs = inner_table.children;
	inner_trs= inner_trs[2].children;
	for (let j=0; j<inner_trs.length; j++) {
	 let inner_tds = inner_trs[j].children;
		for(let i=0; i<inner_tds.length; i++) {
		 inner_tds[i].addEventListener('change', async (e) => {
			 var data = inner_tds[i].children[0].value;
			 let newArr = [];
			 if(i===1) newArr = suggestTree.updateBaseTag(document.getElementsByClassName('title')[0].textContent, data, j-1);
			 if(i===0) newArr = suggestTree.updateBaseForm(document.getElementsByClassName('title')[0].textContent, data, j-1);
			 suggestTree = newArr;
			 console.log(suggestTree)
		 })
		}
	 }
	})
});

search.addEventListener('click', async () => {
    let arr = getResults(suggestTree, options);
	while (inner_table.firstChild) {
		inner_table.removeChild(inner_table.firstChild);
	}
while (results_container.firstChild) {
    results_container.removeChild(results_container.firstChild);
}
var table = document.createElement('table');
var tr2 = document.createElement('tr');  
	var te = document.createTextNode('word');
	var th = document.createElement('th');
	var te2 = document.createTextNode('frequency');
	var th2 = document.createElement('th');
	var te3 = document.createTextNode('tags');
	var th3 = document.createElement('th');
	th.appendChild(te);
	tr2.appendChild(th);
	th2.appendChild(te2);
	tr2.appendChild(th2);
	th3.appendChild(te3);
	tr2.appendChild(th3);
	table.appendChild(tr2);
arr.map((el) => {
	var tr = document.createElement('tr');  
	var td1 = document.createElement('td');
	td1.style.width = '150px';
	var td2 = document.createElement('td');
	td2.style.width = '100px';
	var td3 = document.createElement('td');
	td3.style.width = '100px';

	var text1 = document.createTextNode(el.word);
	var text2 = document.createTextNode(el.frequency);
	var input1 = document.createElement('textarea');
	input1.className = 'input1';
	input1.value = el.part;

	td1.appendChild(text1);
	td2.appendChild(text2);
	td3.appendChild(input1);


	tr.appendChild(td1);
	 tr.appendChild(td2);
	 tr.appendChild(td3);


	table.appendChild(tr);
})
results_container.appendChild(table);
var trs = table.children;
for (let j=0; j<trs.length; j++) {
	let tds = trs[j].children;
	tds[0].addEventListener('click', async (e) => {
	   while (inner_table.firstChild) {
		inner_table.removeChild(inner_table.firstChild);
	}
	   var in_table = document.createElement('table');
	   in_table.className='innertable';
	   var tr2 = document.createElement('tr');  
		   var te = document.createTextNode('base form');
		   var th = document.createElement('th');
		   var te2 = document.createTextNode('tags');
		   var th2 = document.createElement('th');
		   th.appendChild(te);
		   tr2.appendChild(th);
		   th2.appendChild(te2);
		   tr2.appendChild(th2);
		   in_table.appendChild(tr2);
		   let arr = suggestTree.getDictionary();
		   arr.map((el) => {
		   if(el.word === tds[0].textContent) {
			for(let i=0; i<el.lemma.length; i++){
				let tr3 = document.createElement('tr');  
				let td1 = document.createElement('td');
				let td2 = document.createElement('td');
				let input3 = document.createElement('textarea');
				input3.className = 'input3';
				input3.value = el.lemma[i][0];
				let input2 = document.createElement('textarea');
				input2.className = 'input2';
				input2.value = el.lemma[i][1];
				td1.appendChild(input3);
				td2.appendChild(input2);
				tr3.appendChild(td1);
				 tr3.appendChild(td2);
				 in_table.appendChild(tr3);
			}
		}
	   })
	   var span = document.createElement('span');
	   var p = document.createElement('span');
	   p.className = 'title';
	   var textt1 = document.createTextNode('All base forms for word: ');
	   var textt = document.createTextNode(tds[0].textContent);
	   span.appendChild(textt1);
	   p.appendChild(textt);
	   inner_table.appendChild(span);
	   inner_table.appendChild(p);
	   inner_table.appendChild(in_table);
	})
	for (let i=0; i<tds.length; i++) {
		tds[i].addEventListener('change', async (e) => {
			var data = tds[i].children[0].value;
			let newArr = [];
			if(i===2) newArr = suggestTree.updateAllTags(tds[0].textContent, data);
		//	if(i===4) newArr = suggestTree.updateBaseTag(tds[0].textContent, data);
		//	if(i===3) newArr = suggestTree.updateBaseForm(tds[0].textContent, data);
			suggestTree = newArr;
		})
   }
}

inner_table.addEventListener('click', async (e) => {
var inner_trs = inner_table.children;
inner_trs= inner_trs[2].children;
for (let j=0; j<inner_trs.length; j++) {
 let inner_tds = inner_trs[j].children;
	for(let i=0; i<inner_tds.length; i++) {
	 inner_tds[i].addEventListener('change', async (e) => {
		 var data = inner_tds[i].children[0].value;
		 let newArr = [];
		 if(i===1) newArr = suggestTree.updateBaseTag(document.getElementsByClassName('title')[0].textContent, data, j-1);
		 if(i===0) newArr = suggestTree.updateBaseForm(document.getElementsByClassName('title')[0].textContent, data, j-1);
		 suggestTree = newArr;
		 console.log(suggestTree)
	 })
	}
 }
})
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
	modal.style.display = "none";
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