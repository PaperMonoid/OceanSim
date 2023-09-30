<div align="center">
  <a href="https://github.com/PaperMonoid/OceanSim">
	<img src="images/ocean-sim.gif"/>
  </a>
  <h3 align="center">Ocean Sim</h3>
</div>

## About

An ocean simulation using the Phillips Spectrum. It tells us the energy of waves at different frequencies. It considers how hard the wind is blowing, how the waves align with the wind, and the force of gravity. The result helps us understand and simulate the movement and appearance of ocean waves. It is described by

$$ P_h(k) = A \frac{exp(-1/(kL)^2)}{k^4} | \^{k} \dot \^{w}^|2 $$
<br/>

and this equation tells us how much energy is at different wave frequencies. The bigger the value, the bigger the waves.

+ $P_h(k)$ This is the energy of the waves at a specific frequency (think of it like tuning into a radio station; different frequencies will have different amounts of energy).
+ $A$ This is just a number that helps us adjust the overall energy. We can think of it as the volume knob on a radio.
+ $k$ This is our frequency. It's like the radio station we're tuning into.
+ $L = \frac{V^2}{g}$ represents the size of the largest waves that can be formed by a continuous wind blowing at speed $V$. While $g$ is the force of gravity pulling the waves down. Imagine blowing over a bowl of water. If you blow softly (low V), you'll make tiny ripples. If you blow really hard, you'll make bigger waves. L captures this idea.
+ $\^{k} \dot \^{w}$ This part checks how the waves are aligned with the wind. Waves that move in the same direction as the wind get more energy, while waves moving perpendicular (or sideways) to the wind don't get as much. Think of it as trying to push someone on a swing. If you push from behind, they swing high. But if you push them from the side, not much happens.

## Acknowledgements
Portions of this code, specifically the complex numbers, FFT, and IFFT procedures, were influenced by or based on work by Vail Systems from [vail-systems/node-fft Name](https://github.com/vail-systems/node-fft). Their work is licensed under the MIT License. See the LICENSE file for detailed licensing information.

## References
1. Tessendorf J. Simulating ocean water. Simulating nature: realistic and interactive techniques. SIGGRAPH. 2001 Aug;1(2):5.
2. Acerola. I Tried Simulating The Entire Ocean [Video]. YouTube. 2023 Aug 31 [cited 2023 Sep 29]. Available from: https://www.youtube.com/watch?v=yPfagLeUa7k&ab_channel=Acerola
