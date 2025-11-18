# Strudel Reactor
## Introduction
This project allows you to run a strudel script and control it with muting buttons, selectable patterns, and sliders. It also allows you to visualise the volume of your song with a d3 graph, and the melody of your song with the piano roll.

## Pattern and Slider Specification
To specify a pattern, use the format `<pattern>[Name]:[Option 1]:[Option 2]</pattern>`, separating each option with a colon. This creates a pattern with multiple options you can select and is very useful for making it easier to switch what melody is playing or what drum rhythm is playing.

To specify a slider, use the format `<slider>[Name]:[Minimum Value]:[Maximum Value]</slider>`, separating each option with a colon. This allows you to use a slider

## Installation
To install the project, go into the top folder, and write `npm install`. This will install all of the necessary packages required to run the program.

After installing the project, to run the project, type `npm start`.

## Bonus Points

### Song
To create this dark techno song, I first made an outline of it in Ableton Live 12. After creating the song, I then ported it over to strudel. I started by creating the dissonant chords and then used those same notes to create the roomy arp. After creating the roomy arp, I then made the acid pluck which uses notes from the C# major scale. I then added the high-pitched ringing/string sound to add intensity in certain parts of the track. I then made the trance melody which also uses notes from the C# scale. Finally I created all of the percussion elements including a closed hi-hat, two open hi-hats of different intensity, and two kicks, with one of them being normal with some bit crushing for spice, and the other one acting as a "rumble" with lots of reverb and a low-pass filter to make the lower frequencies "rumble".

### Video
To make the video, I first recorded the video with my webcam and desktop screen share in OBS. After recording the video, I used Davinci Resolve 20 to edit the video. I created a fusion composition clip and put a rectangle with a radius in it. I then duplicated it using the duplicate node and then animated the height of the 20 rectangles to match to the audio by converting the audio to midi and then using the MIDI Extractor.