# signtyper
A web application for documenting signs in Filipino Sign Language (FSL).


## A multi-media approach
SignTyper uses a multi-media approach for documenting FSL signs. 
- Alongside `sign gloss`, it uses the `Hamburg Notation System (HamNoSys)` to describe individual signs. 
- `HamNoSys` transcriptions are then converted into `Sign Gestural Markup Language (SiGML)`.
- Through `SiGML`, it is able to synthesize natural sign language performance using virtual human characters using the `JASigning` system.

## SyntheSign
SignTyper offers a tool called `SyntheSign`, which automatically converts HamNoSys symbols to synthetic sign animation.

This tool functions on top of two interfaces:

* A derivative of [HamNoSys2SiGML](https://github.com/carolNeves/HamNoSys2SiGML) : Python code that converts HamNoSys characters and their corresponding gloss into Sign Gestural Markup Language (SiGML).
* [JASigning Software]() : Virtual signing system that sythesises natural sign language performance using virtual human characters.

SyntheSign also provides **a guided HamNoSys input system** to aid the user in transcribing complex signs. The transcription system used (HamNoSys) is universal to all sign languages. **SyntheSign can be used for other sign languages as well, and not just FSL**.

## Current Progress
1. An inventory of FSL handshapes is being uploaded to be used for indexing a small lexicon for FSL signs.
2. Videos of humans signing basic FSL words are being transcribed to HamNoSys to populate the lexicon.

### Translation
Resources regarding FSL grammar are being collected for the development of an automatic translation system from English to Filipino Sign Language (FSL) using the current API.
