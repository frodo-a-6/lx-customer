package com.lx.customer.management.controller;

import com.lx.customer.management.model.Customer;
import com.lx.customer.management.repository.CustomerRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/customers")
public class CustomerController extends CrudController<Customer, Long> {
    public CustomerController(CustomerRepository repository) {
        super(repository);
    }
}
