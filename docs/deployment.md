# HomeGrow Forecast Tool - Deployment Guide

This guide provides comprehensive instructions for deploying the HomeGrow Forecast Tool in different environments.

## Prerequisites

- Docker and Docker Compose installed
- Git
- Node.js v14+ and npm (for local development)
- MongoDB (if not using Docker)

## Local Development Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/homegrow-forecast.git
   cd homegrow-forecast
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy example env files
   cp .env.example backend/.env
   cp .env.example frontend/.env
   ```

4. Edit the environment files as needed for your local setup.

5. Start the development servers:
   ```bash
   # Start backend server (from backend directory)
   cd ../backend
   npm run dev

   # Start frontend development server (in a new terminal, from frontend directory)
   cd ../frontend
   npm start
   ```

6. Access the application at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Docker Deployment

### Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/homegrow-forecast.git
   cd homegrow-forecast
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start the containers:
   ```bash
   docker-compose up -d
   ```

4. Access the application at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

5. View logs:
   ```bash
   docker-compose logs -f
   ```

6. Stop the containers:
   ```bash
   docker-compose down
   ```

### Production Environment

For production deployment, additional security measures should be implemented:

1. Create a production docker-compose file:
   ```bash
   cp docker-compose.yml docker-compose.prod.yml
   ```

2. Edit `docker-compose.prod.yml` to:
   - Remove development volumes
   - Add proper restart policies
   - Implement proper network isolation
   - Use production-ready MongoDB configuration

3. Create a production `.env` file:
   ```bash
   cp .env.example .env.prod
   ```

4. Edit `.env.prod` with secure production settings:
   - Use strong, randomly generated JWT secret
   - Configure MongoDB with authentication
   - Set NODE_ENV to production

5. Deploy using the production configuration:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

6. Set up a reverse proxy (Nginx or similar) for TLS termination:
   ```
   # Example Nginx configuration
   server {
     listen 80;
     server_name homegrowforecast.com www.homegrowforecast.com;
     
     location / {
       return 301 https://$host$request_uri;
     }
   }

   server {
     listen 443 ssl;
     server_name homegrowforecast.com www.homegrowforecast.com;
     
     ssl_certificate /path/to/certificate.crt;
     ssl_certificate_key /path/to/private.key;
     
     # Frontend
     location / {
       proxy_pass http://localhost:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
     
     # Backend API
     location /api {
       proxy_pass http://localhost:5000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```

7. Set up automated backups for MongoDB:
   ```bash
   # Example backup script
   #!/bin/bash
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   BACKUP_DIR="/path/to/backups"
   
   # Create backup directory if it doesn't exist
   mkdir -p $BACKUP_DIR
   
   # Backup MongoDB
   docker exec -it homegrow-mongo mongodump --out /data/backup/$TIMESTAMP
   
   # Copy backup from container to host
   docker cp homegrow-mongo:/data/backup/$TIMESTAMP $BACKUP_DIR
   
   # Cleanup old backups (keep last 7 days)
   find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
   ```

## Cloud Deployment (AWS)

1. Set up AWS resources:
   - EC2 instance (t3.medium or higher)
   - MongoDB Atlas or DocumentDB
   - Amazon S3 (for asset storage)
   - CloudFront (for CDN)
   - Route 53 (for DNS)

2. Configure security groups:
   - Allow inbound traffic on ports 80 and 443
   - Restrict SSH access to known IPs
   - Set up proper networking for database access

3. Clone the repository on your EC2 instance:
   ```bash
   git clone https://github.com/yourusername/homegrow-forecast.git
   cd homegrow-forecast
   ```

4. Set up environment variables for AWS deployment:
   ```bash
   cp .env.example .env.aws
   ```

5. Edit `.env.aws` with your cloud-specific settings:
   - Set MongoDB Atlas connection string
   - Configure S3 bucket for asset storage
   - Set up proper JWT settings

6. Deploy using Docker Compose:
   ```bash
   docker-compose -f docker-compose.aws.yml up -d
   ```

7. Set up an Elastic Load Balancer with TLS termination.

8. Create a CloudWatch dashboard for monitoring.

## Scaling Considerations

For larger deployments, consider the following:

1. **Horizontal Scaling**:
   - Deploy multiple backend instances behind a load balancer
   - Implement session sharing (Redis)
   - Configure sticky sessions if needed

2. **Database Scaling**:
   - Use MongoDB replica sets for high availability
   - Consider sharding for horizontal scaling
   - Implement proper indexing strategies

3. **Caching Layer**:
   - Implement Redis for API response caching
   - Add CDN for static assets

4. **Monitoring and Alerting**:
   - Set up Prometheus and Grafana for monitoring
   - Configure alerts for system health
   - Implement centralized logging with ELK stack

## CI/CD Pipeline

1. Set up GitHub Actions or Jenkins for automated testing and deployment:
   ```yaml
   # Example GitHub Actions workflow
   name: Deploy HomeGrow Forecast

   on:
     push:
       branches: [ main ]

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '14'
         - name: Install dependencies
           run: |
             cd backend
             npm install
             cd ../frontend
             npm install
         - name: Run tests
           run: |
             cd backend
             npm test
             cd ../frontend
             npm test

     deploy:
       needs: test
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to production
           uses: appleboy/ssh-action@master
           with:
             host: ${{ secrets.HOST }}
             username: ${{ secrets.USERNAME }}
             key: ${{ secrets.SSH_KEY }}
             script: |
               cd homegrow-forecast
               git pull
               docker-compose -f docker-compose.prod.yml down
               docker-compose -f docker-compose.prod.yml up -d --build
   ```

## Maintenance Procedures

1. **Database Backups**:
   - Schedule daily backups
   - Test backup restoration procedures
   - Store backups in multiple locations

2. **Updates and Patches**:
   - Set up a staging environment for testing updates
   - Implement blue-green deployment for zero-downtime updates
   - Create rollback procedures

3. **Performance Monitoring**:
   - Regular review of application logs
   - Monitor API response times
   - Track database query performance

4. **Security**:
   - Regular dependency updates
   - Security vulnerability scanning
   - Scheduled penetration testing

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check MongoDB connection string
   - Verify network connectivity
   - Ensure proper authentication

2. **API 500 Errors**:
   - Check backend logs for details
   - Verify environment variables
   - Test API endpoints with Postman

3. **Frontend Loading Issues**:
   - Check browser console for errors
   - Verify API connectivity
   - Clear browser cache

### Debug Tools

1. **Backend Debugging**:
   ```bash
   # View backend logs
   docker-compose logs -f backend
   
   # Access MongoDB shell
   docker exec -it homegrow-mongo mongo
   ```

2. **Frontend Debugging**:
   - Use React Developer Tools browser extension
   - Enable source maps in production builds
   - Implement logging service

## Support Resources

- GitHub Issues: [https://github.com/yourusername/homegrow-forecast/issues](https://github.com/yourusername/homegrow-forecast/issues)
- Documentation: [https://github.com/yourusername/homegrow-forecast/docs](https://github.com/yourusername/homegrow-forecast/docs)
- Email Support: support@homegrowforecast.com