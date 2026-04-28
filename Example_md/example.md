# Mars: The Red Planet

Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System.

## Overview

Mars is a terrestrial planet with a thin atmosphere, having surface features reminiscent both of the impact craters of the Moon and the volcanoes, valleys, deserts, and polar ice caps of Earth.

### Quick Facts

| Attribute | Value |
|-----------|-------|
| **Diameter** | 6,779 km |
| **Mass** | 6.39 × 10^23 kg |
| **Orbital Period** | 687 Earth days |
| **Day Length** | 24h 37m |
| **Moons** | 2 (Phobos, Deimos) |

## Surface & Geography

Mars has the largest volcano in the Solar System - **Olympus Mons** - standing at approximately 21 km tall.

> "Mars is the only planet we've explored where a human could survive with a spacesuit and breathe only the CO2 in the atmosphere."
> — Dr. Ellen Stofan, NASA

### Notable Features

- **Valles Marineris** - A canyon system longer than the Grand Canyon
- **Hellas Planitia** - A massive impact basin
- **Polar Ice Caps** - Frozen water and carbon dioxide

## Missions to Mars

1. **Viking Program** (1975) - First successful landers
2. **Mars Pathfinder** (1997) - Delivered Sojourner rover
3. **Curiosity Rover** (2012) - Still active, exploring Gale Crater
4. **Perseverance Rover** (2021) - Collecting samples for return
5. **Mars 2020 Perseverance** - Testing oxygen production

### Code Example: Mars Distance Calculation

```python
def distance_to_mars():
    earth_orbit = 149.6  # million km
    mars_orbit = 227.9   # million km

    min_distance = mars_orbit - earth_orbit
    max_distance = mars_orbit + earth_orbit

    return min_distance, max_distance

min_d, max_d = distance_to_mars()
print(f"Mars distance: {min_d}-{max_d} million km")
```

## Atmosphere

The atmosphere of Mars consists of:

- Carbon dioxide (95.3%)
- Nitrogen (2.7%)
- Argon (1.6%)
- Oxygen (0.13%)

## References

- [NASA Mars Exploration](https://mars.nasa.gov)
- [Wikipedia: Mars](https://en.wikipedia.org/wiki/Mars)

---

*Last updated: 2026*