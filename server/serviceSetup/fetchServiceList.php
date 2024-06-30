<?php include '../connection.php';
header('Content-Type:application/json');

try {
    $sqlCategory = 'SELECT * FROM services_category';
    $stmt = $connection->prepare($sqlCategory);
    $stmt->execute();
    $result_category = $stmt->get_result();

    $respone = [];
    while ($row_category = $result_category->fetch_assoc()) {
        $sqlServiceList = 'SELECT * FROM services_list WHERE category_name_id=?';
        $stmtServiceList = $connection->prepare($sqlServiceList);
        $stmtServiceList->bind_param('i', $row_category['id']);
        $stmtServiceList->execute();
        $result_serviceList = $stmtServiceList->get_result();

        $serviceData = [];
        while ($row_service = $result_serviceList->fetch_assoc()) {
            $fetchlist = [
                'id' => $row_service['id'],
                'service_name' => $row_service['serviceName'],
                'service_duration' => $row_service['serviceDuration'],
            ];
            $serviceData[] = $fetchlist;
        }

        $data = [
            'id' => $row_category['id'],
            'category_name' => $row_category['category_name'],
            'service_list' => $serviceData,
        ];
        $respone[] = $data;
    }
    $stmtServiceList->close();
    $stmt->close();
    $connection->close();

    echo json_encode($respone);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>
