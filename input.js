'use strict';

// The following is in a variable rather than in a comment
// because that way it can be output.
var license="Stenopgaver\n\
Copyright (C) 2018 Lars Rune Præstmark\n\
\n\
This program is free software; you can redistribute it and/or\n\
modify it under the terms of the GNU General Public License\n\
as published by the Free Software Foundation; either version 2\n\
of the License, or (at your option) any later version.\n\
<br/>\n\
This program is distributed in the hope that it will be useful,\n\
but WITHOUT ANY WARRANTY; without even the implied warranty of\n\
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n\
GNU General Public License for more details.\n\
<br/>\n\
You should have received a <a href=\"LICENSE\">copy of the\n\
GNU General Public License</a>\n\
along with this program; if not, write to the Free Software\n\
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.\n\
<br>There is of course <a href=\"https://github.com/SeaLiteral/stenopgaver\">a repository</a>\n\
with source code.\
"


var outString=""
var counting=false
var countFrom=false
var countTo=false
var doneCounting=false
var writeField
var showField
var theoryField

var texts=Array()
texts['cat']='Can Ted pat the red cat? Is this pad what Hess had? This cat is the pet. It purrs at the set and it purrs at that purchaser patting the hat. The cap is the hat. The cat had the sap. And that is the rap. Are saps as rad as paps?'

texts['skak']='Kåre så på skak og Rikke så på kar. Kåre kan så bær og Rikke er kæk. Er Saras kat kær? Kåre er kok. Rikkes sok er på Rikkes skab. Kåre kan skære kager. Er Rikke skrap? Råb og reb. Sara er rap.'

var textNames=['cat|Can Ted pat the red cat?', 'skak|Kåre så på skak']

var summaries=Array()

summaries['cat']='Here are some sentences with simple words and commonly briefed words. Here is a diagram of the layout. Concentrate on first learning the keys that aren\'t greyed out. The vowels in the bottom row are pressed with the thumbs. The consonants in the left side are written with the left hand and are called initial consonants. The consonants in the right side are written with the right hand and called final consonants. To write a simple one syllable word, use the vowel keys to write the vowel in the middle of the word, the initial consonants to write consonants before it, and the final consonants to write consonants after it. And press all of the keys in the word at the same time. However, some words are usually written in a simplified way because they are very common, so look at the table and try to learn the words in it. You might notice there are two initial S keys. Pressing one, the other or both has the same effect, so just use whichever you find easiest.<pre>S T P H * <span class="right">F</span> P <span class="right">L</span> T D\nS K <span class="right">W</span> R * R <span class="right">B G</span> S <span class="right">Z</span>\n    A <span class="right">O</span>   E U</pre>The asterisk in the middle is a wildcard for things like disambiguating homophones. But in this exercise you\'ll have to use it for something else: Plover\'s default dictionary uses PUR as a brief for "purchaser" because that word is much more common than "purr", so you\'ll have to use the asterisk key to write "purr". Also, if you make a mistake, you can use the asterisk as a backspace of sorts that undoes the last stroke.<br/><table><tr><th>Word</th><th>Brief</th></tr><tr><td>it</td><td>T-</td></tr><tr><td>is</td><td>S-</td></tr><tr><td>the</td><td>-T</td><tr><td>can</td><td>K-</td></tr></tr><tr><td>this</td><td>TH-</td></tr><tr><td>are</td><td>R-</td></tr><tr><td>and</td><td>SKP-</td></tr><tr><td>that</td><td>THA</td></tr><tr><td>what</td><td>WHA</td></tr></table>'

summaries['skak']='Her er nogle vokaler, foreløbig kan I godt se bort fra længde og stød:<ul><li>A, sådan som det udtales i "skak"</li><li>Æ, som i "kæk"</li><li>AÆ, et almindelight a, som i "skat"</li><li>Å, som en "å"</li><li>O, som i "klokke".</li></ul>Dem skriver vi med tommelfingrene. Konsonanter skriver vi med de andre fingre, og så bruger vi venstre hånd til dem, der skal stå før vokalerne og højre hånd til dem, der skal stå efter dem. Her kan I se hvor tasterne er på stenografitastaturet. Bare se bort fra de grå, dem skal vi nok se på senere.<pre><span class="right">-N T</span> P <span class="right">H</span> * <span class="right">F</span> P <span class="right">L T D</span>\n S K <span class="right">V</span> R * R <span class="right">E</span> K S <span class="right">D</span>\n     A O   Æ Å</pre>'

var WAIT='WAIT'
var PART='PART'
var RIGHT='RIGHT'
var WRONG='WRONG'

function fillText(){
    showField=document.getElementById("textDisplay")
    writeField=document.getElementById("textInput")
    theoryField=document.getElementById("textTheory")
    var splitAdress=(document.location).toString().split('?')
    var lastPart=''
    var hashAmount=splitAdress.length
    if(hashAmount>=2){
        lastPart=splitAdress[1]
    }
    if(lastPart==''){
        outString='<ul>'
        for (var i in textNames){
            var names=textNames[i].split('|')
            outString+='<li><a href="write.htm?'+names[0]+'">'+names[1]+'</a></li>'
        }
        outString+='</ul>'
        showField.innerHTML=outString.replace(/\n/g,'<br>')
        theoryField.innerHTML="Select a lesson:"
        writeField.style="display: none;"
        showField.innerHTML+='<hr>'+license
    }
    else{
        if(summaries[lastPart]!=undefined){
            theoryField.innerHTML=summaries[lastPart]
        }
        else{
            theoryField.style="display: none;"
        }
        outString=texts[lastPart.toString()]
        showField.innerHTML=outString.replace(/\n/g,'<br>')
        writeField.onkeyup=checkText
    }
}
function checkText(){
    var wordsOut=outString.split(' ')
    var wordsIn =writeField.value.split(' ')
    var wordsNew = Array()
    var checkLength=wordsOut.length
    if(counting==false){
        countFrom=Date.now()
        counting=true
    }
    if(wordsIn.length<wordsOut.length){
        checkLength=wordsIn.length
    }
    var newWords=[]
    for(var i=0;i<wordsOut.length;i++){
        if((i<checkLength)&&(wordsIn[i]==wordsOut[i])){
            newWords.push([RIGHT, wordsOut[i]])
        }
        else if(wordsIn[i]==''){
            newWords.push([WAIT, wordsOut[i]])
        }
        else if((i<checkLength)&&(wordsOut[i].startsWith(wordsIn[i]))){
            if(wordsIn.length<=i+1){
                var x=[PART, wordsOut[i], wordsIn[i].length]
                newWords.push(x)
            }
            else{
                var x=[WRONG, wordsOut[i]]
                newWords.push(x)
            }
        }
        else if(i<wordsIn.length){
            newWords.push([WRONG, wordsOut[i]])
        }
        else{
            newWords.push([WAIT, wordsOut[i]])
        }
    }
    //var newText=newWords.join(' ').replace(/\n/g,'<br>')
    var newText=''
    var previousStatus=WAIT
    var statusCodes=Array()
    for (i in newWords){
        var rawWord=newWords[i]
        if(previousStatus==WAIT){
            statusCodes[WAIT]=''
            statusCodes[RIGHT]='<span class="right">'
            statusCodes[WRONG]='<span class="wrong">'
        }
        else if(previousStatus==RIGHT){
            statusCodes[WAIT]='</span>'
            statusCodes[RIGHT]=''
            statusCodes[WRONG]='</span><span class="wrong">'
        }
        else if(previousStatus==WRONG){
            statusCodes[WAIT]='</span>'
            statusCodes[RIGHT]='</span><span class="right">'
            statusCodes[WRONG]=''
        }
        if(i!=0){
            newText+=' '
        }
        if(rawWord[0]==WAIT){
            newText+=statusCodes[WAIT]+rawWord[1]
            previousStatus=WAIT
        }
        else if(rawWord[0]==WRONG){
            newText+=statusCodes[WRONG]+rawWord[1]
            previousStatus=WRONG
        }
        else if(rawWord[0]==RIGHT){
            newText+=statusCodes[RIGHT]+rawWord[1]
            previousStatus=RIGHT
        }
        else if(rawWord[0]==PART){
            var startWord=rawWord[1].substring(0, rawWord[2])
            var endWord=rawWord[1].substring(rawWord[2], rawWord[1].length)
            newText+=statusCodes[RIGHT]+startWord+'</span>'+endWord
            previousStatus=WAIT
        }
    }
    if(previousStatus!=WAIT){
        newText+='</span>'
    }
    showField.innerHTML=newText
    if((writeField.value==outString)&&(!doneCounting)){
        countTo=Date.now()
        var timeTaken=(countTo-countFrom)/1000
        var outLength=outString.length
        timeField=document.getElementById("timeField")
        timeField.innerHTML=outLength.toString()+" characters in "+((Math.round(timeTaken*100))/100).toString()+" seconds: "+(Math.round(100*outLength/timeTaken)/100).toString()+" CPS"
        doneCounting=true
    }
    writeField=document.getElementById("textInput")
}
window.onload=fillText
