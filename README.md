# StudyTimerComponent
Study Timer Web Component is a reusable web component built using React that can be embedded into any web application through a custom HTML tag.

## Instalation
#### 1. Clone the repository
Open a terminal and run the following command to download the source code:
``` 
git clone https://github.com/927TriponBriana/StudyTimerComponent.git
```
#### 2. Install dependencies
Download all the required project dependencies using:
``` 
npm install
```
#### 3. Start the development server
To run the local development server use:
``` 
npm run dev
```
After this, open http://localhost:5173/ in any web browser to test the component.
## Usage and attributes
Import the script in the index.html:
``` 
<script type="module" src="path/to/script/study-timer-component.jsx"></script>
```
Then use as a usual HTML element:
```
<study-timer-component duration="number" break-duration="number" theme="string" sound="boolean"></study-timer-component>
```
There are four customizable parameters:
| Attribute | Description | Type | Default |
|------|---------|------|------|
| duration  | Duration of a focus session (minutes) | Number |25|
| break-duration  | Duration of a break session (minutes) | Number |5|
| theme | Component theme (light or dark) | String |light|
| sound |Enables sound notification when a session finishes|Boolean|false|

## Features
The component currently provides the following functionality:
#### 1. Timer Management & Session Statistics
The component tracks study activity and stores statistics in Local Storage. 
- Start timer
- Pause timer
- End timer
- Automatic switching between focus and break modes
- Completed focus sessions
- Completed break sessions
- Total focus minutes

Statistics can be reset independently from the timer.
#### 2. Theme Support
The component supports two visual themes (light mode and dark mode). This can be configured through component attributes.
#### 3. Circular Progress Indicator & Sound Notifications
The remaining session time is visualized using an animated SVG circular progress indicator. Also, the component can play a notification sound whenever a study or break session finishes.
The progress circle is implemented using two SVG `<circle>` elements:
- A background circle
- A progress circle

The progress circle uses the SVG properties `strokeDasharray` and `strokeDashoffset` to visually represent the completion percentage.
```jsx
const radius = 90;
const stroke = 12;
const normalizedRadius = radius - stroke / 2;
const circumference = normalizedRadius * 2 * Math.PI;

const strokeDashoffset =
    circumference - (progress / 100) * circumference;
```

The SVG rendering logic:
```jsx
<svg height={radius * 2} width={radius * 2}>
    <circle
        stroke={currentStyles.circleBackground.stroke}
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
    />

    <circle
        stroke={currentStyles.circleProgress.stroke}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{
            transition: 'stroke-dashoffset 1s linear',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
        }}
    />
</svg>
```

As the timer decreases, the `progress` value is recalculated and the `strokeDashoffset` property updates automatically, creating a smooth animated countdown effect.
#### 4. Local Storage Persistence
The component automatically saves:
- Current timer mode
- Remaining session time

This allows users to refresh the page without losing progress.
#### 5. Custom Events
The component exposes several custom events that allow external applications to react to timer state changes.

timer-started  (triggered when the timer starts):
```javascript
timer.addEventListener('timer-started', () => {
  console.log('Timer started');
});
```
timer-paused (triggered when the timer pauses):
```javascript
timer.addEventListener('timer-paused', () => {
  console.log('Timer paused');
});
```
timer-reset (triggered when the timer resets):
```javascript
timer.addEventListener('timer-reset', () => {
  console.log('Timer reset');
});
```
timer-finished (triggered when a study or break session finishes):
```javascript
timer.addEventListener('timer-finished', (event) => {
  console.log('Timer finished:', event.detail);
});
```
mode-changed (triggered when switching between focus and break modes):
```javascript
timer.addEventListener('mode-changed', (event) => {
  console.log('Mode changed:', event.detail.mode);
});
```
