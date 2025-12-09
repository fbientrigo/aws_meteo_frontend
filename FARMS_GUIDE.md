# 📍 GUÍA: SISTEMA DE PARCELAS (FARMS)

## 🎯 **¿QUÉ SON LAS PARCELAS?**

Las **parcelas** (farms) son las **ubicaciones geográficas** donde tienes tus terrenos agrícolas. Funcionan como el **punto de referencia central** para todo el análisis de riesgos y soluciones.

### **Rol de las Parcelas:**

1. **📍 Ubicación Central**
   - El mapa se centra automáticamente en la parcela seleccionada
   - Define el área de análisis para riesgos climáticos

2. **📊 Contexto de Datos**
   - Los riesgos se calculan específicamente para esa ubicación
   - Las soluciones se recomiendan basadas en la parcela
   - Los cultivos y rendimientos históricos se asocian a cada parcela

3. **🗂️ Organización**
   - Puedes tener múltiples parcelas
   - Cada una con sus propios datos independientes
   - Cambias entre parcelas usando el selector en el header

---

## ➕ **CÓMO AGREGAR UNA NUEVA PARCELA**

### **Método 1: Desde el Header (Recomendado)**

1. **Haz click en el botón "Agregar Parcela"** (botón con ícono `+` en el header)
   
2. **Completa el formulario:**
   - **Nombre** *: Ej: "Parcela Norte", "Sector Maíz"
   - **Ubicación** *: Busca la ubicación en Chile
   - **Área (hectáreas)** *: Ej: 120
   - **Tipo de Suelo** (opcional): Ej: "Franco Arcilloso"
   - **Sistema de Riego** (opcional): Ej: "Goteo y Aspersión"

3. **Buscar Ubicación:**
   - Escribe la dirección o lugar en el campo de búsqueda
   - Presiona Enter o haz click en el botón de búsqueda
   - Selecciona la ubicación correcta de los resultados
   - Verás las coordenadas confirmadas

4. **Guardar:**
   - Haz click en "Agregar Parcela"
   - El mapa volará automáticamente a la nueva ubicación
   - La nueva parcela se seleccionará automáticamente

---

## 🔄 **CAMBIAR ENTRE PARCELAS**

### **Selector de Parcelas (Header)**

```
┌────────────────────────────────────┐
│ 📍 [Cerro Campana (120 ha)    ▼] │
│    [+ Agregar Parcela]             │
└────────────────────────────────────┘
```

1. Haz click en el selector de parcelas
2. Selecciona la parcela que quieres ver
3. El mapa se centrará automáticamente en esa ubicación

---

## 📋 **ESTRUCTURA DE UNA PARCELA**

Cada parcela contiene:

```typescript
{
  id: 'farm-1',
  name: 'Cerro Campana',
  location: { 
    lat: -33.6642, 
    lng: -70.9289 
  },
  area: 120, // hectáreas
  soilType: 'Franco Arcilloso',
  irrigationSystem: 'Goteo y Aspersión',
  crops: [
    {
      id: 'crop-1',
      name: 'Trigo',
      area: 45,
      distribution: 37.5,
      irrigationSystem: 'Aspersión',
      avgYield: 5.2,
      riskLevel: 'high'
    },
    // ... más cultivos
  ],
  historicalYield: [
    { year: 2020, crop: 'Trigo', yield: 4.8 },
    { year: 2021, crop: 'Trigo', yield: 5.1 },
    // ... más datos históricos
  ]
}
```

---

## 🎨 **INTERFAZ MEJORADA**

### **Header con Selector de Parcelas:**

```
┌─────────────────────────────────────────────────────────┐
│ [☰] [S] SbNAI │ 📍 [Parcela] [+ Agregar] │ 💡 Tip │ 🔔 👤 │
└─────────────────────────────────────────────────────────┘
```

**Características:**
- ✅ Ícono de ubicación (📍) para claridad
- ✅ Muestra el área de cada parcela en el selector
- ✅ Botón "Agregar Parcela" visible y accesible
- ✅ Tooltip informativo sobre el buscador del mapa

---

## 🔧 **FUNCIONALIDADES IMPLEMENTADAS**

### **1. Agregar Parcela**
- ✅ Diálogo modal con formulario completo
- ✅ Búsqueda de ubicación integrada (OpenStreetMap)
- ✅ Validación de datos
- ✅ Vuelo automático a la nueva ubicación
- ✅ Selección automática de la nueva parcela

### **2. Selector de Parcelas**
- ✅ Dropdown con todas las parcelas
- ✅ Muestra nombre y área de cada parcela
- ✅ Ícono de ubicación en cada opción
- ✅ Cambio suave con animación de carga
- ✅ Vuelo automático al cambiar de parcela

### **3. Gestión de Estado**
- ✅ Store actualizado con métodos `addFarm` y `removeFarm`
- ✅ Persistencia en memoria durante la sesión
- ✅ Sincronización automática con el mapa

---

## 📝 **EJEMPLO DE USO**

### **Escenario: Agricultor con 3 Parcelas**

```
Parcela 1: "Cerro Campana" (120 ha)
├─ Ubicación: -33.6642, -70.9289
├─ Cultivos: Trigo, Maíz, Uvas, Tomates
└─ Riesgos: Sequía (alta), Olas de calor (alta)

Parcela 2: "Valle Central" (85 ha)
├─ Ubicación: -33.7123, -70.8456
├─ Cultivos: Maíz, Frijoles
└─ Riesgos: Inundación (media), Erosión (media)

Parcela 3: "Sector Norte" (45 ha)
├─ Ubicación: -33.6234, -70.9567
├─ Cultivos: Hortalizas
└─ Riesgos: Heladas (baja), Sequía (media)
```

**Workflow:**
1. Usuario selecciona "Valle Central" en el selector
2. Mapa vuela a esa ubicación
3. Riesgos se actualizan para esa zona
4. Soluciones se recomiendan específicamente para esos riesgos

---

## 🚀 **PRÓXIMAS MEJORAS SUGERIDAS**

### **Funcionalidades Adicionales:**

1. **Editar Parcelas**
   - Modificar nombre, área, tipo de suelo
   - Actualizar ubicación
   - Agregar/editar cultivos

2. **Eliminar Parcelas**
   - Botón de eliminar con confirmación
   - Limpieza de datos asociados

3. **Importar/Exportar**
   - Importar parcelas desde archivo CSV/JSON
   - Exportar datos de parcelas

4. **Gestión de Cultivos**
   - Agregar cultivos a cada parcela
   - Tracking de rendimientos históricos
   - Proyecciones de cosecha

5. **Comparación de Parcelas**
   - Vista comparativa de riesgos entre parcelas
   - Análisis de rendimiento relativo
   - Recomendaciones de optimización

6. **Integración con Polígonos**
   - Convertir polígonos dibujados en parcelas
   - Asociar polígonos a parcelas existentes

---

## 📊 **DIFERENCIA: PARCELAS vs POLÍGONOS**

### **Parcelas (Farms):**
- 🏠 **Ubicación permanente** de tu terreno
- 📍 **Punto central** con coordenadas
- 📊 **Datos históricos** y cultivos asociados
- 🔄 **Persistente** entre sesiones

### **Polígonos (Drawn Polygons):**
- 🖊️ **Áreas temporales** dibujadas en el mapa
- 📐 **Forma geométrica** con múltiples puntos
- 🔍 **Análisis puntual** de riesgos en esa área
- ⏱️ **Temporal** (se pueden borrar fácilmente)

**Relación:**
- Una parcela puede tener múltiples polígonos dibujados
- Los polígonos se usan para analizar áreas específicas dentro de una parcela
- Ejemplo: Parcela "Cerro Campana" → Polígono "Sector Trigo Norte"

---

## 🎯 **RESUMEN**

✅ **Parcelas** = Ubicaciones permanentes de tus terrenos  
✅ **Agregar** = Botón "+ Agregar Parcela" en el header  
✅ **Cambiar** = Selector dropdown en el header  
✅ **Función** = Contexto para análisis de riesgos y soluciones  

---

**Implementado por:** Antigravity AI  
**Fecha:** 2025-11-30  
**Estado:** ✅ COMPLETADO
