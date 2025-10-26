package com.fullstack.equipmentlendingportal.service;

import com.fullstack.equipmentlendingportal.entity.BaseRequest;
import com.fullstack.equipmentlendingportal.entity.BaseResponse;

public interface UserService {

    BaseResponse registerUser(BaseRequest request);

    BaseResponse loginUser(BaseRequest request);

}
