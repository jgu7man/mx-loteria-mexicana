#!/bin/bash

# Crear carpeta para las imágenes descargadas
mkdir -p downloaded_images

# Inicializar contador
counter=1

# Leer cada línea del archivo untitled:Untitled-1
while IFS= read -r url; do
    # Verificar que la línea no esté vacía
    if [ -n "$url" ]; then
        # Generar nombre de archivo
        filename="downloaded_images/image_$counter.jpg"
        echo "Descargando $url a $filename"
        # Descargar la imagen
        curl -s -o "$filename" "$url"
        # Pausa de 10 segundos para evitar alertas
        sleep 10
        # Verificar si la descarga fue exitosa
        if [ $? -eq 0 ]; then
            echo "Descargado: $filename"
        else
            echo "Error descargando: $url"
        fi
        ((counter++))
    fi
done < image_urls.txt

echo "Descarga completada. Imágenes guardadas en la carpeta 'downloaded_images'."