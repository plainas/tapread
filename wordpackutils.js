
function parse_wordpacks_source(raw_input_text){
    var paragraphs = [];

    var lines = raw_input_text.split("\n");
    var trimmed_lines = lines.map( l => l.trim());

    var state = "WAITING_FOR_PARAGRAPH";
    var current_paragraph = {};

    for (let i = 0; i < trimmed_lines.length; i++) {
        const line = trimmed_lines[i];

        if (!line){
            if("content_lines" in current_paragraph){
                paragraphs.push(current_paragraph);
            }
            state = "WAITING_FOR_PARAGRAPH";
            current_paragraph = {};
            continue;
        }else if(state == "WAITING_FOR_PARAGRAPH"){
            current_paragraph.key= line;
            state = "GOT_KEY";
        }else if( state == "GOT_KEY"){
            current_paragraph.title = line;
            state = "GOT_TITTLE";
        }else if( state == "GOT_TITTLE"){
            current_paragraph.content_lines = [line];
            state = "COLLECTING_LINES";
        }else if( state == "COLLECTING_LINES"){
            current_paragraph.content_lines.push(line)
        }
    }

    if("content_lines" in current_paragraph){
        paragraphs.push(current_paragraph);
    }

    paragraphs.forEach(p => {
        p.wordpack = string_to_wordpack(p.content_lines.join(' '));
    });

    return paragraphs;
}

var sync_get = function (url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    return request.responseText;
}

var string_to_wordpack = function (text) {
    let basic_word_bits = text.toLowerCase().split(/[\s\n]/);
    let word_bits_no_spaces = basic_word_bits.map( s => trimAny(s," .?!-\n"));
    let words_array = word_bits_no_spaces.filter(Boolean);
    let unique_words_array = [...new Set(words_array)]; 
    return unique_words_array;
}

function trimAny(str, chars) {
    var start = 0;
    var end = str.length;
    while (start < end && chars.indexOf(str[start]) >= 0){
        ++start;
    }
    while (end > start && chars.indexOf(str[end - 1]) >= 0){
        --end;
    }
    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}