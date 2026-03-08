package com.example.bundle;

import com.bmc.arsys.rx.application.common.ServiceLocator;
import com.bmc.arsys.rx.services.common.*;
import com.bmc.arsys.rx.services.common.annotation.AccessControlledMethod;
import com.bmc.arsys.rx.services.common.annotation.RxDefinitionTransactional;
import com.bmc.arsys.rx.services.record.RecordService;
import com.bmc.arsys.rx.services.record.domain.RecordDefinition;
import org.springframework.transaction.annotation.Isolation;

import java.util.*;

/**
 * This code shows how to create a custom datapagequery.
 *
 * The name of the datapage query is the package name and the class name:
 * package com.example.bundle;
 * public class SimpleDataPageQuery
 * So:
 * com.example.bundle.SimpleDataPageQuery
 */
public class SimpleDataPageQuery  extends DataPageQuery {
    private int pageSize = 50;
    private int startIndex = 0;

    // Constructor.
    // Setting the query parameters and getting required parameters.
    public SimpleDataPageQuery(DataPageQueryParameters dataPageQueryParameters) {
        super(dataPageQueryParameters);

        pageSize = dataPageQueryParameters.getPageSize();
        startIndex = dataPageQueryParameters.getStartIndex();
    }

    /**
     * Executes the datapagequery.
     */
    @Override
    @RxDefinitionTransactional(readOnly = true, isolation = Isolation.DEFAULT, rollbackFor = Exception.class)
    @AccessControlledMethod(authorization = AccessControlledMethod.AuthorizationLevel.SubAdministrator, licensing = AccessControlledMethod.LicensingLevel.Application, checkSchemaForSpecialAccess = true, promoteStructAdmin = true)
    public DataPage execute() {
        List<Fruit> fruitList = new ArrayList<>();

        // Getting the list of Fruits
        fruitList = getFruits();

        // Returns the data, allowing Jackson to serialize it for us.
        return new DataPage(fruitList.size(), fruitList);
    }
}