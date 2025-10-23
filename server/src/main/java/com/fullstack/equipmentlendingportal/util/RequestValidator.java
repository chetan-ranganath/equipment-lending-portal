package com.fullstack.equipmentlendingportal.util;

import com.fullstack.equipmentlendingportal.entity.BaseRequest;
import com.fullstack.equipmentlendingportal.entity.BaseResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class RequestValidator {

    /**
     * PASSWORD_REGEX enforces a strong password policy.
     * Explanation:
     * ^                     : Start of string
     * (?=.*[0-9])           : At least one digit [0-9]
     * (?=.*[a-z])           : At least one lowercase letter [a-z]
     * (?=.*[A-Z])           : At least one uppercase letter [A-Z]
     * (?=.*[@#$%^&+=])      : At least one special character from the listed set
     * (?=\\S+$)             : No whitespace allowed (entire string must be non-whitespace)
     * .{8,}                 : At least 8 characters in total
     * $                     : End of string
     * <p>
     * Examples of valid passwords:
     * - Passw0rd!
     * - Str0ng@Pwd
     * - A1b2C3d4$
     * <p>
     * Examples of invalid passwords:
     * - password (no uppercase, number, or special character)
     * - Password (no number or special character)
     * - P@sswrd (no number)
     **/
    private static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";


    private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

    private static final String INVALID_USER_MSG = "Invalid/Missing Username";
    private static final String INVALID_PASSWORD_MSG = "Password does not meet standards";
    private static final String MISSING_PARAMS_MSG = "Mandatory Param missing";

    public List<BaseResponse> validateRequest(BaseRequest request, boolean loginFlag) {
        List<BaseResponse> validationList = new ArrayList<>();
        if(request.getUserName()==null || request.getUserName().isBlank() || request.getUserName().isEmpty()){
            validationList.add(new BaseResponse("400", INVALID_USER_MSG, null));
        }


        if (!isValidPassword(request.getPassword())) {
            validationList.add(new BaseResponse("400", INVALID_PASSWORD_MSG, null));
        }

        if (!isMandatoryParamsPresent(request, loginFlag)) {
            validationList.add(new BaseResponse("400", MISSING_PARAMS_MSG, null));
        }

        return validationList;
    }

    private boolean isMandatoryParamsPresent(BaseRequest request, boolean loginFlag) {
        if (loginFlag) {
            return true;
        }
        return request.getPhone() != null && !request.getPhone().isBlank() && request.getUserName() != null && !request.getUserName().isBlank();
    }

    private boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }

}

