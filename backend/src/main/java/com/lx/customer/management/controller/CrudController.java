package com.lx.customer.management.controller;

import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

public abstract class CrudController<T, ID> {
    protected final JpaRepository<T, ID> repository;

    protected CrudController(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<T> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @GetMapping("/{page}/{size}/{orderBy}/{direction}")
    public List<T> findAll(@PathVariable int page, @PathVariable int size, @PathVariable String orderBy, @PathVariable String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), orderBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return repository.findAll(pageable).getContent();
    }


    @GetMapping("/{id}")
    public ResponseEntity<T> findById(@PathVariable ID id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<T> create(@RequestBody T entity) {
        T savedEntity = repository.save(entity);
        return ResponseEntity.ok(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> update(@PathVariable ID id, @RequestBody T entity) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(repository.save(entity));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable ID id) {
        repository.deleteById(id);
    }
}
