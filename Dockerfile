FROM nginx:alpine

# Copy the static files from the 'out' directory to the Nginx default public directory
COPY out /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
