package com.springbootecommerce.config;

import com.springbootecommerce.entity.Product;
import com.springbootecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MySpringDataRestConfig implements RepositoryRestConfigurer {

    @Value("${allowed.origins}")
    private  String[] allowedOrigins;

    private EntityManager entityManager;

    @Autowired
    public MySpringDataRestConfig(EntityManager theEntityManager) {
        this.entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        // Disable http methods PUT, POST, DELETE, PATCH for product repository in v3.0
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedActions)))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));

        // Disable http methods PUT, POST, DELETE, PATCH for product Category repository in v3.0
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedActions)))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));

        // call an internal helper method
        exposeIds(config);

        // configure cors mapping
        cors.addMapping(config.getBasePath()+"/**").allowedOrigins(allowedOrigins);
    }


    private void exposeIds(RepositoryRestConfiguration config) {
        // Expose entity ids in Spring Data Rest

        // -get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // -create array of the entity types
        List<Class> entityClass = new ArrayList<>();

        // -get the entity types for the entities
        for(EntityType entityType: entities) {
            entityClass.add(entityType.getJavaType());
        }

        // -expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClass.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}