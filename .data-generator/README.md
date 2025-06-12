# Candidate Generator

Este script genera candidatos aleatorios durante 2 minutos para probar el dashboard de métricas de Grafana.

## Características

- **Duración**: 2 minutos de generación continua
- **Nombres aleatorios**: Combinación de animal + color (ej: "Leon Rojo", "Aguila Azul")
- **Excel dinámico**: Genera archivos Excel únicos con los datos específicos de cada candidato
- **Experiencia**: Entre 1-10 años aleatoria
- **Seniority**: Automática basada en experiencia (>5 años = Senior)
- **Disponibilidad**: Aleatoria (true/false)
- **Intervalos**: Entre 0.5-1.5 segundos entre candidatos
- **Estadísticas**: Muestra total creado, errores y tasa de éxito

## Requisitos

1. El backend debe estar ejecutándose en `http://localhost:8080`
2. Node.js instalado
3. Las dependencias npm instaladas (`xlsx`, `node-fetch`, `form-data`)

## Instalación

```bash
cd example
npm install
```

## Uso

```bash
# Opción 1: Con npm
npm start

# Opción 2: Directamente con node
node generate-candidates.js
```

## Ejemplo de salida

```
🎯 Starting candidate generation for 2 minutes...
📊 Generating dynamic Excel files with candidate data
🌐 API endpoint: http://localhost:8080/candidates
──────────────────────────────────────────────────
✅ [1] Created: Zorro Amarillo (Senior, 9y, Available: true)
⏱️  Waiting 1.34s before next candidate...
✅ [2] Created: Atun Oliva (Senior, 7y, Available: true)
⏱️  Waiting 1.325s before next candidate...
✅ [3] Created: Bisonte Negro (Junior, 1y, Available: false)
⏱️  Waiting 1.302s before next candidate...
...
──────────────────────────────────────────────────
🏁 Generation completed!
📊 Statistics:
   - Total created: 45
   - Total errors: 0
   - Success rate: 100.0%
🎉 Done! Check your Grafana dashboard to see the metrics.
```

## Interrupción

Puedes interrumpir el script en cualquier momento con `Ctrl+C` y verás las estadísticas finales.

## Verificación

Después de ejecutar el script, puedes verificar:

1. **Dashboard de Grafana**: `http://localhost:3001` - Business Metrics dashboard
2. **Métricas directas**: `curl http://localhost:8080/metrics | grep candidates_created`
3. **API de candidatos**: `curl http://localhost:8080/candidates`